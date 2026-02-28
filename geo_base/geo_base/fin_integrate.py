import cv2
import time
import os
import numpy as np
from ultralytics import YOLO
import serial
import threading
from collections import deque
from datetime import datetime
from queue import Queue
import requests
import json
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


# =========================
# CONFIG
# =========================
SERIAL_PORT = 'COM6'
BAUDRATE = 115200
BACKEND_EVENTS_API = "http://localhost:5000/api/events"

OUTPUT_DIR = r"C:\Users\ADMIN\GEOMETRICA\geo_base\geo_base\webcam_frames"
DEPTH_OUTPUT_DIR = r"C:\Users\ADMIN\GEOMETRICA\geo_base\geo_base\outputs"
UPLOAD_DIR = r"C:\Users\ADMIN\GEOMETRICA\geo_base\geo_base\uploads"

MODEL_PATH = r"C:\Users\ADMIN\GEOMETRICA\geo_base\geo_base\best.pt"

CAPTURE_INTERVALS = [0, 0.2, 0.4]
CONF_THRESHOLD = 0.6
ACCEL_THRESHOLD_CM = 1470  # 2g

FOCAL_PX = 1000.0
BASELINE_CM = 10.0
TARGET_AVG_DEPTH_CM = 10
MIN_DEPTH_CM, MAX_DEPTH_CM = 0.0, 15.0
NUM_DISP = 96
BLOCK_SZ = 9

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(DEPTH_OUTPUT_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)
BACKEND_EVENTS_API = "http://localhost:5000/api/events"
existing_files = set()

# =========================
# LOCATION (NO HARDCODE IN EVENTS)
# =========================
# Provide real coordinates by either:
# 1) setting env vars: GEOMETRICA_LAT / GEOMETRICA_LON
# 2) writing a file: geo_base/geo_base/gps_location.json with:
#    {"lat": 11.01, "lon": 77.01}
GPS_LOCATION_FILE = os.path.join(os.path.dirname(__file__), "gps_location.json")
DEFAULT_LOCATION = {"lat": 11.24, "lon": 77.15}

def _parse_float(v):
    try:
        return float(v)
    except Exception:
        return None

def get_current_location():
    # 1) env vars
    lat = _parse_float(os.environ.get("GEOMETRICA_LAT"))
    lon = _parse_float(os.environ.get("GEOMETRICA_LON"))
    if lat is not None and lon is not None:
        return {"lat": lat, "lon": lon}

    # 2) json file
    try:
        if os.path.exists(GPS_LOCATION_FILE):
            with open(GPS_LOCATION_FILE, "r", encoding="utf-8") as f:
                data = json.load(f) or {}
            lat = _parse_float(data.get("lat"))
            lon = _parse_float(data.get("lon"))
            if lat is not None and lon is not None:
                return {"lat": lat, "lon": lon}
    except Exception as e:
        print("⚠️ Failed to read gps_location.json:", e)

    # 3) fallback
    return DEFAULT_LOCATION

def get_location_from_image_exif(img_path):
    # Optional: if images contain GPS EXIF (many apps strip it; WhatsApp often does)
    try:
        from PIL import Image
        from PIL.ExifTags import TAGS, GPSTAGS
    except Exception:
        return None

    def _get_if_exist(data, key):
        return data.get(key)

    def _convert_to_degrees(value):
        # value is a tuple of rationals: (deg, min, sec)
        d = value[0][0] / value[0][1]
        m = value[1][0] / value[1][1]
        s = value[2][0] / value[2][1]
        return d + (m / 60.0) + (s / 3600.0)

    try:
        img = Image.open(img_path)
        exif = img._getexif() or {}
        gps_info = None
        for tag, val in exif.items():
            decoded = TAGS.get(tag, tag)
            if decoded == "GPSInfo":
                gps_info = {}
                for t in val:
                    sub_decoded = GPSTAGS.get(t, t)
                    gps_info[sub_decoded] = val[t]
                break

        if not gps_info:
            return None

        lat_val = _get_if_exist(gps_info, "GPSLatitude")
        lat_ref = _get_if_exist(gps_info, "GPSLatitudeRef")
        lon_val = _get_if_exist(gps_info, "GPSLongitude")
        lon_ref = _get_if_exist(gps_info, "GPSLongitudeRef")

        if not lat_val or not lon_val or not lat_ref or not lon_ref:
            return None

        lat = _convert_to_degrees(lat_val)
        if lat_ref != "N":
            lat = -lat
        lon = _convert_to_degrees(lon_val)
        if lon_ref != "E":
            lon = -lon

        return {"lat": float(lat), "lon": float(lon)}
    except Exception:
        return None

# =========================
# GLOBALS
# =========================
ser = None
pothole_event = threading.Event()
accel_event = threading.Event()

latest_accel_z = 0
frame_id = 0
cap = None
model = None

upload_queue = Queue()

# =========================
# HELPERS
# =========================
def should_store_event(avg_depth, accel_z=None):
    if avg_depth is not None and avg_depth > 4.0:
        return True
    if accel_z is not None and abs(accel_z * 100) > ACCEL_THRESHOLD_CM:
        return True
    return False
def push_event_to_backend(event_data):
    try:
        response = requests.post(
            BACKEND_EVENTS_API,
            json=event_data,
            timeout=5
        )

        if response.status_code == 201:
            print("✅ Event successfully pushed to backend")
        else:
            print("⚠️ Backend responded with:", response.status_code, response.text)

    except Exception as e:
        print("❌ Error pushing event to backend:", e)


# =========================
# MPU6050
# =========================
def setup_serial():
    global ser
    try:
        ser = serial.Serial(SERIAL_PORT, BAUDRATE, timeout=1)
        print("✅ MPU6050 connected")
    except Exception as e:
        print(f"❌ Serial error: {e}")

def read_accel_z():
    if ser and ser.in_waiting:
        try:
            return float(ser.readline().decode().strip())
        except:
            pass
    return None

# =========================
# IMAGE UTILS
# =========================
def safe_read_and_resize(path, size=(640, 480)):
    img = cv2.imread(path)
    if img is None:
        raise FileNotFoundError(path)
    return cv2.resize(img, size)

def apply_perspective_correction(img):
    h, w = img.shape[:2]
    src = np.float32([[100, h-100], [w-100, h-100], [w-200, 200], [200, 200]])
    dst = np.float32([[0, h], [w, h], [w, 0], [0, 0]])
    H, _ = cv2.findHomography(src, dst)
    return cv2.warpPerspective(img, H, (w, h))

def align_to_base(base, other):
    orb = cv2.ORB_create(4000)
    kp1, des1 = orb.detectAndCompute(base, None)
    kp2, des2 = orb.detectAndCompute(other, None)
    if des1 is None or des2 is None:
        return None
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = bf.match(des1, des2)
    if len(matches) < 8:
        return None
    src = np.float32([kp1[m.queryIdx].pt for m in matches]).reshape(-1,1,2)
    dst = np.float32([kp2[m.trainIdx].pt for m in matches]).reshape(-1,1,2)
    H, _ = cv2.findHomography(dst, src, cv2.RANSAC, 5.0)
    return cv2.warpPerspective(other, H, (base.shape[1], base.shape[0])) if H is not None else None

def compute_disp(l, r):
    stereo = cv2.StereoSGBM_create(
        minDisparity=0,
        numDisparities=NUM_DISP,
        blockSize=BLOCK_SZ,
        P1=8 * BLOCK_SZ**2,
        P2=32 * BLOCK_SZ**2,
        uniquenessRatio=8
    )
    disp = stereo.compute(l, r).astype(np.float32) / 16.0
    disp[disp < 0] = 0
    return disp

# =========================
# DEPTH PIPELINE
# =========================
def estimate_depth_from_images(img_paths):
    imgs = [apply_perspective_correction(safe_read_and_resize(p)) for p in img_paths]
    grays = [cv2.cvtColor(i, cv2.COLOR_BGR2GRAY) for i in imgs]

    aligned = [grays[0]]
    for i in range(1, len(grays)):
        a = align_to_base(grays[0], grays[i])
        if a is not None:
            aligned.append(a)

    if len(aligned) < 2:
        return None, None

    disps = []
    for i in range(len(aligned) - 1):
        disps.append(compute_disp(aligned[i], aligned[i + 1]))

    fused = np.median(np.stack(disps), axis=0)
    depth_path = os.path.join(DEPTH_OUTPUT_DIR, f"depth_{int(time.time())}.png")
    cv2.imwrite(depth_path, cv2.applyColorMap(
        cv2.normalize(fused, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8),
        cv2.COLORMAP_TURBO))

    valid = fused[fused > 0]
    if valid.size == 0:
        return None, depth_path

    depth = (FOCAL_PX * BASELINE_CM) / (valid + 1e-6)
    depth *= TARGET_AVG_DEPTH_CM / np.mean(depth)
    depth = np.clip(depth, MIN_DEPTH_CM, MAX_DEPTH_CM)

    return float(np.mean(depth)), depth_path

# =========================
# UPLOAD DIR WATCHER
# =========================
# =========================
# UPLOAD DIR WATCHER
# =========================
class UploadFolderHandler(FileSystemEventHandler):
    def __init__(self):
        self.buffer = []

    def on_created(self, event):
        if event.is_directory:
            return

        if not event.src_path.lower().endswith((".jpg", ".jpeg", ".png")):
            return

        # 🚫 IGNORE FILES THAT EXISTED BEFORE PYTHON STARTED
        if event.src_path in existing_files:
            return

        print("📥 New uploaded image detected:", event.src_path)
        self.buffer.append(event.src_path)

        if len(self.buffer) >= 3:
            img_paths = self.buffer[:3]
            self.buffer = self.buffer[3:]
            self.process_images(img_paths)

    def process_images(self, img_paths):
        print("🧠 Processing uploaded images for depth...")

        try:
            avg_depth, depth_map = estimate_depth_from_images(img_paths)

            if avg_depth is None:
                print("⚠️ Depth estimation failed")
                return

            print(f"📏 Estimated avg depth = {avg_depth:.2f} cm")

            if should_store_event(avg_depth):
                loc = get_location_from_image_exif(img_paths[0]) or get_current_location()
                event_data = {
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "source": "manual_upload",
                "location": loc,
                "vision": {"avg_depth_est_cm": avg_depth},
                "artifacts": {
                    "frames": img_paths,
                    "depth_map": depth_map
                    }
                }

                push_event_to_backend(event_data)
            else:
                print("ℹ️ Upload ignored (depth <= 4cm)")

        finally:
        # ✅ ALWAYS DELETE IMAGES
            for img in img_paths:
                try:
                    if os.path.exists(img):
                        os.remove(img)
                        print(f"🗑️ Deleted processed image: {img}")
                except Exception as e:
                    print(f"❌ Failed to delete {img}: {e}")


        

# =========================
# UPLOAD MODE
# =========================
def enqueue_uploaded_images(img_paths, lat=None, lon=None):
    upload_queue.put({"paths": img_paths, "lat": lat, "lon": lon})

def upload_worker():
    while True:
        if not upload_queue.empty():
            task = upload_queue.get()
            ts = datetime.utcnow().isoformat() + "Z"

            try:
                avg_depth, depth_map = estimate_depth_from_images(task["paths"])

                if avg_depth is None:
                    print("⚠️ Depth estimation failed")
                    continue

                print(f"📏 Estimated avg depth = {avg_depth:.2f} cm")

                if should_store_event(avg_depth):
                    event_data = {
                        "timestamp": ts,
                        "source": "manual_upload",
                        "location": {
                            "lat": task.get("lat", 11.24),
                            "lon": task.get("lon", 77.15)
                        },
                        "vision": {
                            "avg_depth_est_cm": avg_depth
                        },
                        "artifacts": {
                            "frames": task["paths"],
                            "depth_map": depth_map
                        }
                    }

                    print("📤 UPLOAD EVENT STORED:")
                    print(event_data)
                    push_event_to_backend(event_data)
                else:
                    print("ℹ️ Upload ignored (depth <= 4cm)")

            finally:
                # ✅ ALWAYS DELETE IMAGES
                for img in task["paths"]:
                    try:
                        if os.path.exists(img):
                            os.remove(img)
                            print(f"🗑️ Deleted uploaded image: {img}")
                    except Exception as e:
                        print(f"❌ Failed to delete {img}: {e}")

        time.sleep(0.2)


# =========================
# LIVE THREADS
# =========================
def camera_thread():
    global cap
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        res = model.predict(frame, conf=CONF_THRESHOLD, verbose=False)
        if len(res[0].boxes) > 0:
            pothole_event.set()
        cv2.imshow("Live Detection", res[0].plot())
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()

def accel_thread():
    global latest_accel_z
    setup_serial()
    while True:
        val = read_accel_z()
        if val is not None:
            latest_accel_z = val
            if abs(val * 100) > ACCEL_THRESHOLD_CM:
                accel_event.set()
        time.sleep(0.01)

def main_event_handler():
    global frame_id

    while True:
        if pothole_event.is_set() or accel_event.is_set():
            ts = datetime.utcnow().isoformat() + "Z"
            paths = []

            try:
                # 📸 Capture frames
                for i, d in enumerate(CAPTURE_INTERVALS):
                    time.sleep(d)
                    ret, frame = cap.read()
                    if ret:
                        p = os.path.join(OUTPUT_DIR, f"frame_{frame_id+i}.jpg")
                        cv2.imwrite(p, frame)
                        paths.append(p)

                frame_id += len(paths)

                if not paths:
                    print("⚠️ No frames captured")
                    continue

                # 🧠 Estimate depth
                avg_depth, depth_map = estimate_depth_from_images(paths)

                if avg_depth is None:
                    print("⚠️ Depth estimation failed for live frames")
                    continue

                print(f"📏 Live avg depth = {avg_depth:.2f} cm")

                # ❌ Ignore if not significant
                if not should_store_event(avg_depth, latest_accel_z):
                    print("ℹ️ Live event ignored")
                    continue

                # ✅ Store event
                loc = get_current_location()
                event_data = {
                    "timestamp": ts,
                    "source": "live_detection",
                    "location": loc,
                    "vision": {"avg_depth_est_cm": avg_depth},
                    "imu": {"peak_z_cm_s2": latest_accel_z * 100},
                    "artifacts": {
                        "frames": paths,
                        "depth_map": depth_map
                    }
                }

                print("🚀 LIVE EVENT STORED:")
                print(event_data)
                push_event_to_backend(event_data)

            finally:
                # 🧹 ALWAYS CLEAN UP FRAMES
                for img in paths:
                    try:
                        if os.path.exists(img):
                            os.remove(img)
                            print(f"🗑️ Deleted live frame: {img}")
                    except Exception as e:
                        print(f"❌ Failed to delete live frame {img}: {e}")

                # 🔄 Reset triggers
                pothole_event.clear()
                accel_event.clear()

        time.sleep(0.05)

    


# =========================
# MAIN
# =========================
if __name__ == "__main__":
    model = YOLO(MODEL_PATH)

    cap = cv2.VideoCapture(1, cv2.CAP_DSHOW)
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

    threading.Thread(target=camera_thread, daemon=True).start()
    threading.Thread(target=accel_thread, daemon=True).start()
    threading.Thread(target=main_event_handler, daemon=True).start()
    threading.Thread(target=upload_worker, daemon=True).start()

    # =========================
    # SNAPSHOT EXISTING FILES
    # =========================
    existing_files = set(
        os.path.join(UPLOAD_DIR, f)
        for f in os.listdir(UPLOAD_DIR)
        if f.lower().endswith((".jpg", ".jpeg", ".png"))
    )

    print(f"🛑 Ignoring {len(existing_files)} existing files in UPLOAD_DIR")

    # =========================
    # START UPLOAD DIR WATCHER
    # =========================
    observer = Observer()
    upload_handler = UploadFolderHandler()
    observer.schedule(upload_handler, UPLOAD_DIR, recursive=False)
    observer.start()

    print("👀 Watching UPLOAD_DIR for new images...")

    # =========================
    # KEEP PROCESS ALIVE (CRITICAL)
    # =========================
    try:
        while True:
            time.sleep(1)    
    except KeyboardInterrupt:
        print("🛑 Shutting down watcher...")
        observer.stop()
        observer.join()

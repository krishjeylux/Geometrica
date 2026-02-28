import cv2
import torch
import torch.nn as nn
import numpy as np
import threading
import time
import os
from collections import deque
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# =========================
# CONFIG
# =========================
MODEL_PATH = "C:\\pothole_detection\\models\\pothole_unet.pth"
UPLOAD_DIR = "C:\\pothole_detection\\uploads"

IMG_SIZE = 192
THRESHOLD = 0.25
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

CAMERA_INDEX = 0
POTHOLE_AREA_THRESH = 800
FRAME_GAP = 5
COOLDOWN_FRAMES = 40
EXIT_KEY = 27

MIN_DISP = 1.5
MAX_DISP = 60.0
DISP_VERIFY_THRESH = 2.0

os.makedirs(UPLOAD_DIR, exist_ok=True)

# =========================
# U-NET
# =========================
class UNet(nn.Module):
    def __init__(self):
        super().__init__()
        def CBR(i, o):
            return nn.Sequential(
                nn.Conv2d(i, o, 3, padding=1),
                nn.ReLU(inplace=True),
                nn.Conv2d(o, o, 3, padding=1),
                nn.ReLU(inplace=True)
            )
        self.enc1 = CBR(3, 64)
        self.enc2 = CBR(64, 128)
        self.enc3 = CBR(128, 256)
        self.pool = nn.MaxPool2d(2)
        self.bottleneck = CBR(256, 512)
        self.up3 = nn.ConvTranspose2d(512, 256, 2, 2)
        self.dec3 = CBR(512, 256)
        self.up2 = nn.ConvTranspose2d(256, 128, 2, 2)
        self.dec2 = CBR(256, 128)
        self.up1 = nn.ConvTranspose2d(128, 64, 2, 2)
        self.dec1 = CBR(128, 64)
        self.final = nn.Conv2d(64, 1, 1)

    def forward(self, x):
        e1 = self.enc1(x)
        e2 = self.enc2(self.pool(e1))
        e3 = self.enc3(self.pool(e2))
        b = self.bottleneck(self.pool(e3))
        d3 = self.up3(b)
        d3 = self.dec3(torch.cat([d3, e3], 1))
        d2 = self.up2(d3)
        d2 = self.dec2(torch.cat([d2, e2], 1))
        d1 = self.up1(d2)
        d1 = self.dec1(torch.cat([d1, e1], 1))
        return torch.sigmoid(self.final(d1))

model = UNet().to(DEVICE)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.eval()

# =========================
# SEGMENTATION
# =========================
def segment(frame):
    h, w, _ = frame.shape
    img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE)) / 255.0
    img = torch.tensor(img).permute(2,0,1).unsqueeze(0).float().to(DEVICE)
    with torch.no_grad():
        pred = model(img)[0,0].cpu().numpy()
    mask = (pred > THRESHOLD).astype(np.uint8)
    return cv2.resize(mask, (w, h))

def pothole_present(mask):
    return np.sum(mask) > POTHOLE_AREA_THRESH

# =========================
# DISPARITY VERIFICATION
# =========================
orb = cv2.ORB_create(2000)

def verify_pair(imgA, imgB, maskA):
    kpA, desA = orb.detectAndCompute(cv2.cvtColor(imgA, cv2.COLOR_BGR2GRAY), None)
    kpB, desB = orb.detectAndCompute(cv2.cvtColor(imgB, cv2.COLOR_BGR2GRAY), None)

    if desA is None or desB is None:
        return False, None, None

    bf = cv2.BFMatcher(cv2.NORM_HAMMING)
    raw = bf.knnMatch(desA, desB, k=2)

    pothole_disp, road_disp = [], []

    for m, n in raw:
        if m.distance < 0.75 * n.distance:
            xA, yA = kpA[m.queryIdx].pt
            xB, yB = kpB[m.trainIdx].pt
            disp = abs(yB - yA)

            if disp < MIN_DISP or disp > MAX_DISP:
                continue

            xi, yi = int(xA), int(yA)
            if maskA[yi, xi] == 1:
                pothole_disp.append(disp)
            else:
                road_disp.append(disp)

    if pothole_disp and road_disp:
        pothole_med = np.median(pothole_disp)
        road_med = np.median(road_disp)
        valid = pothole_med > road_med + DISP_VERIFY_THRESH
        return valid, pothole_med, road_med

    return False, None, None

# =========================
# LIVE CAMERA THREAD
# =========================
def live_camera_loop():
    cap = cv2.VideoCapture(CAMERA_INDEX)
    print("🎥 Live camera running")

    frames, capturing, counter, cooldown = [], False, 0, 0
    last_disp = (None, None)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        mask = segment(frame)
        preview = frame.copy()
        preview[mask == 1] = (0,0,255)

        if last_disp[0] is not None:
            cv2.putText(preview, f"Pothole Disp: {last_disp[0]:.2f}",
                        (10,30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,255), 2)
            cv2.putText(preview, f"Road Disp: {last_disp[1]:.2f}",
                        (10,60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,0), 2)

        cv2.imshow("Live Feed", preview)

        if cooldown > 0:
            cooldown -= 1
        else:
            if pothole_present(mask) and not capturing:
                capturing, frames, counter = True, [], 0
                print("🕳️ Live pothole detected")

            if capturing:
                if counter % FRAME_GAP == 0:
                    frames.append(frame.copy())
                counter += 1

                if len(frames) == 3:
                    ok1, p1, r1 = verify_pair(frames[0], frames[1], segment(frames[0]))
                    ok2, p2, r2 = verify_pair(frames[1], frames[2], segment(frames[1]))

                    if p1 and r1:
                        last_disp = (p1, r1)

                    print(f"LIVE DISP → Pothole: {p1}, Road: {r1}")
                    if p1 and r1:
                        disp=p1-r1
                    else:
                        print("No pothole detected")

                    capturing, frames, cooldown = False, [], COOLDOWN_FRAMES

        if cv2.waitKey(1) & 0xFF == EXIT_KEY:
            break

    cap.release()
    cv2.destroyAllWindows()

# =========================
# UPLOAD DIRECTORY THREAD
# =========================
class UploadHandler(FileSystemEventHandler):
    def __init__(self):
        self.buffer = deque()

    def on_created(self, event):
        if event.is_directory:
            return
        if event.src_path.lower().endswith((".jpg",".png",".jpeg")):
            self.buffer.append(event.src_path)
            if len(self.buffer) >= 3:
                process_upload([self.buffer.popleft() for _ in range(3)])

def process_upload(paths):
    
    frames = [cv2.imread(p) for p in paths]
    ok, p_disp, r_disp = verify_pair(frames[0], frames[1], segment(frames[0]))
    print("pohole detected in upload:", ok)
    if ok:

        print(f"UPLOAD DISP → Pothole: {p_disp}, Road: {r_disp}")
        disp=p_disp-r_disp
    else:
        print("No pothole detected in upload.")
    for p in paths:
        os.remove(p)

def upload_watcher():
    observer = Observer()
    observer.schedule(UploadHandler(), UPLOAD_DIR, recursive=False)
    observer.start()
    while True:
        time.sleep(1)

# =========================
# MAIN
# =========================
if __name__ == "__main__":
    threading.Thread(target=live_camera_loop, daemon=True).start()
    threading.Thread(target=upload_watcher, daemon=True).start()
    print("🚀 System running")
    while True:
        time.sleep(1)
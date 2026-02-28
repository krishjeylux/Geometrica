import cv2

cap = cv2.VideoCapture(1, cv2.CAP_DSHOW)
print("Opened:", cap.isOpened())

while True:
    ret, frame = cap.read()
    if not ret:
        print("Frame failed")
        break
    cv2.imshow("test", frame)
    if cv2.waitKey(1) == 27:
        break

cap.release()
cv2.destroyAllWindows()

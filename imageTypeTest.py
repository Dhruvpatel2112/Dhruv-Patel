import cv2

while True:
    vs = cv2.VideoCapture(0)
    frame = vs.read()
    print(type(frame[1]))
from ultralytics import YOLO
import cv2

model = YOLO("yolov8n.pt")
results = model(r"C:\Users\Har23\Downloads\강아지.jpg")
result_image = results[0].plot()
output_image_path = r"C:\Users\Har23\Desktop\hancom\13_YOLO\강아지.jpg"
cv2.imwrite(output_image_path, result_image)
print(f"예측 결과 이미지가 잘 저장 되었습니다. {output_image_path}")
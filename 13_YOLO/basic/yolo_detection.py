from ultralytics import YOLO
import cv2

# 1. 모델 로드 (탐지 전용 — 기본 YOLO)
model = YOLO("yolov8n.pt")

# 2. 모델 추론 (이미지 경로 입력)
results = model("input_det.jpg")

# 3. 결과 시각화
result_image = results[0].plot()

# 4. 결과 이미지 저장
output_image_path = "./result_det.jpg"
cv2.imwrite(output_image_path, result_image)
print(f"예측 결과 이미지가 잘 저장 되었습니다. {output_image_path}")
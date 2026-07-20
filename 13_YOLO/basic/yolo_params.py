from ultralytics import YOLO
import cv2

model = YOLO("yolo11n.pt")
print(model.names)

model(
    "input_params.jpg",
    save=True,
    conf=0.5,            # 신뢰도 50% 이상만 탐지
    imgsz=640,           # 추론 이미지 크기
    max_det=5,            # 최대 5개만 탐지
    save_crop=False,       # 탐지 영역 이미지 저장
    save_txt=False,        # 좌표 텍스트 저장
    save_conf=True        # 신뢰도 저장
)
from ultralytics import YOLO

# 1. 모델 로드 (분류 전용 pretrained)
model = YOLO("yolo11n-cls.pt")

# 2. 모델 학습
model.train(
    data="dataset",   # 데이터셋 경로
    epochs=2,         # 학습 횟수 (전체 데이터를 몇 번 반복할지)
    batch=1,          # 배치 사이즈 (한 번에 처리할 이미지 수)
    imgsz=256,        # 이미지 크기 (모든 입력을 256x256으로 리사이즈)
)
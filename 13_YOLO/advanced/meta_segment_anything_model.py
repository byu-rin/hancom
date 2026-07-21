from ultralytics import SAM
import time

# 1. SAM 모델 로드
model = SAM("sam_b.pt")
print("SAM 모델 로드 완료!!")

# 2. 이미지 경로 설정
image_path = "soccer_input.jpg"

# 3. 추론 시간 측정 시작
start_time = time.time()

# 4. SAM 모델 추론
model(image_path, save=True)

# 5. 추론 시간 측정 종료
end_time = time.time()

model_time = end_time - start_time
print(f"총 추론 시간 : {model_time:.2f}")
print("SAM 추론 완료!")

#  SAM은 YOLO보다 더 정밀한 픽셀 단위 세그먼트 가능. 대신 속도는 느림
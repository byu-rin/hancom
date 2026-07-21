from ultralytics import solutions
import cv2

# 1. 비디오 경로 설정
# video_path = "15_yolo/yolo_advance/input.mp4"
cap = cv2.VideoCapture(0)

# 2. 모델 로드 및 Heatmap 객체 생성
heatmap = solutions.Heatmap(
    model="yolo11n.pt",
    show=True,
    # colormap=cv2.COLORMAP_MAGMA  # 색상 지도 (MAGMA = 보라~노랑)
    colormap = cv2.COLORMAP_DEEPGREEN
)

# 3. 비디오 프레임 처리
while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("비디오 읽기 실패 . . .")
        break

    # 누적 히트맵 갱신 (인스턴스 직접 호출, show=True면 내부에서 창까지 그려줌)
    # 반환값은 SolutionResults 객체 — YOLO 추론처럼 results[0].plot() 으로 쓰지 않음
    results = heatmap(frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("q키를 눌러서 종료")
        break

# 4. 자원 해제
cap.release()
cv2.destroyAllWindows()
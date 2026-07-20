from ultralytics import YOLO
import cv2  # OpenCV — 영상 처리·그리기 라이브러리

# 1. CCTV 스트리밍 URL 설정
stream_url = "http://210.99.70.120:1935/live/cctv009.stream/playlist.m3u8"
cap = cv2.VideoCapture(stream_url) # URL을 열어 영상 캡처 객체 생성

# 2. YOLO 모델 로드
model = YOLO("yolo11n.pt")

# 3. 위험 판단 기준
WARNING_THRESHOLD = 5

# 4. 실시간 프레임 처리
while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("웹캠 읽기 실패")
        break
    # 4-1. YOLO 추론
    results = model(frame)

    # 4-2. 탐지 박스 그린 프레임 생성
    annotated_frame = results[0].plot()

    # 4-3. 탐지 객체 수
    count = len(results[0].boxes)

    # 4-4. 탐지 객체 수 기준 상태 및 색 결정
    if count >= WARNING_THRESHOLD:
        status = "Warning"
        color = (0, 0, 255)
    else:
        status = "Safe"
        color = (255, 0, 0)
    
    # 4-5. 탐지 객체 수 및 상태 화면에 표시
    cv2.putText(
        annotated_frame,
        f"Detected : {count}, {status}",
        (10, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        color,
        2,
        cv2.LINE_AA
    )

    # 4-6. 윈도우 창 출력
    cv2.imshow("YOLO_COUNT", annotated_frame)

    # 4-7. q 키 누르면 종료
    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("q키를 눌러서 종료")
        break

# 자원 해제
cap.release()              # 스트림 해제
cv2.destroyAllWindows()    # 모든 OpenCV 창 닫기
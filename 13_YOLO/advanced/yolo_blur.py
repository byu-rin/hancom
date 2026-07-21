from ultralytics import solutions
import cv2

# 1. 비디오 경로 설정 (0 = 웹캠, 파일 경로·RTSP도 가능)
cap = cv2.VideoCapture(0)

# 웹캠의 해상도(가로, 세로)와 FPS(초당 프레임 수) 정보 가져오기
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = cap.get(cv2.CAP_PROP_FPS)
if fps == 0:  # 웹캠에 따라 FPS가 0으로 출력되는 경우 기본값 30 적용
    fps = 30.0

# 2. 비디오 저장 객체(VideoWriter) 설정
# 파일명, 가장 호환성이 좋은 H.264 코덱으로 지정, FPS, (가로, 세로) 크기 지정
output_path = "blurred_output.mp4"
fourcc = cv2.VideoWriter_fourcc(*'XVID')
out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

# 2. 모델 로드 + 블러 객체 생성
blurrer = solutions.ObjectBlurrer(
    model="yolo11n.pt",
    show=True,
    blur_ratio=0.5     # 블러 강도 (0.0~1.0, 높을수록 더 흐림)
)

# 3. 비디오 프레임 처리
while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("웹캠 읽기 실패")
        break

    # 3-1. 탐지 → 박스 영역 자동 블러 (show=True면 내부에서 창까지 표시)
    blurrer(frame)

    # 3-2. q 키로 종료
    # waitKey가 없으면 창이 갱신되지 않아 '응답 없음'이 되고 q로 끌 수도 없음
    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("q키를 눌러서 종료")
        break

# 4. 자원 해제
cap.release()
out.release()  # 파일 저장을 정상적으로 마무리하고 닫음
cv2.destroyAllWindows()    # show=True로 열린 창 정리

print(f"동영상 저장이 완료되었습니다: {output_path}")
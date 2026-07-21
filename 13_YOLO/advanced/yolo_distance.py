from ultralytics import solutions
import cv2

# 1. 비디오 경로 설정
cap = cv2.VideoCapture("input.mp4")

# 2. 모델 로드 및 거리 계산 객체 생성
distance = solutions.DistanceCalculation(
    model="yolo11n.pt",
    show=False
)

# 3. 내 모니터에 맞춘 타겟 가로 해상도 설정
# (화면 크기를 조절하려면 이 숫자만 변경해 주시면 됩니다.)
TARGET_WIDTH = 960 

is_window_setup = False
scale = 1.0

# 4. 마우스 클릭 보정 콜백 함수 정의
def mouse_callback(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        # 축소된 화면의 좌표(x, y)를 배율(scale)을 곱해 원본 영상의 큰 좌표로 복원합니다.
        orig_x = int(x / scale)
        orig_y = int(y / scale)
        
        # 복원된 정확한 원본 좌표를 Ultralytics 거리 계산 엔진에 강제로 주입합니다.
        if hasattr(distance, 'mouse_event_for_distance'):
            distance.mouse_event_for_distance(event, orig_x, orig_y, flags, param)

# 3. 프레임 처리 루프
while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("프레임 읽기 실패")
        break

    # 5-1. 최초 프레임 실행 시 화면 크기와 윈도우 생성 세팅
    if not is_window_setup:
        orig_h, orig_w = frame.shape[:2]
        scale = TARGET_WIDTH / orig_w
        target_height = int(orig_h * scale)
        
        # 우리가 직접 조작할 완전한 창을 생성합니다.
        win_name = "YOLO11 Distance Calculation"
        cv2.namedWindow(win_name, cv2.WINDOW_NORMAL)
        cv2.resizeWindow(win_name, TARGET_WIDTH, target_height)
        
        # 보정된 마우스 함수를 이 창에 바인딩합니다.
        cv2.setMouseCallback(win_name, mouse_callback)
        is_window_setup = True

    # 3-1. 탐지 + 클릭 대상 중심점 거리 계산 (내부 처리)
    distance(frame)

# 5-3. 거리가 그려진 원본 프레임을 사용자가 보기 편한 크기로 축소하여 화면에 출력
    resized_frame = cv2.resize(frame, (TARGET_WIDTH, target_height), interpolation=cv2.INTER_AREA)
    cv2.imshow("YOLO11 Distance Calculation", resized_frame)

    # 3-2. q 키로 종료
    if cv2.waitKey(1) & 0xFF == ord("q"):
        print("q키를 눌러서 종료!!")
        break
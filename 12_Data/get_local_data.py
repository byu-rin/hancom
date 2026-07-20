import cv2
import os
import time
from datetime import datetime
import tkinter as tk
from tkinter import messagebox

# [1단계] 사진을 저장할 폴더 준비
CORRECT_PASSWORD = "0000"
wrong_count = 0
max_attempts = 3
save_dir = "./captured_images"
os.makedirs(save_dir, exist_ok=True) # 폴더 자동생성

# [2단계] 비밀번호 체크
def check_password():
    global wrong_count
    user_input = entry.get() # 입력창에 쓴 글자 가져오기

    if user_input == CORRECT_PASSWORD:
        messagebox.showinfo("성공", "🔓 비밀번호 일치! 환영합니다.")
        root.destroy()
    else:
        wrong_count += 1
        remaining = max_attempts - wrong_count

        if wrong_count >= max_attempts:
            messagebox.showerror("경고", "🚨 비밀번호 3회 오류! 침입자 촬영을 시작합니다.")
            take_photo() 
            root.destroy() # 촬영 후 창 닫기
        else:
            messagebox.showwarning("오류", f"❌ 비밀번호가 틀렸습니다.\n(남은 기회: {remaining}번)")
            entry.delete(0, tk.END) # 입력창 비우기

# [3단계] 3번 틀렸을 때 카메라 촬영 함수
def take_photo():
    cap = cv2.VideoCapture(0)
    time.sleep(1)
    success, frame = cap.read()
    if success:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_path = os.path.join(save_dir, f"gui_intruder_{timestamp}.jpg")
        cv2.inwrite(file_path, frame)
    cap.release()

# [4단계] 실제 윈도우 그래픽 창 그리기 (GUI)
root = tk.Tk()
root.title("보안 로그인")
root.geometry("300x180")
root.resizable(False, False) #창 크기 조절 금지

# 안내문구 레이블
label = tk.Label(root, text="비밀번호 4자리를 입력하세요", font=("맑은 고딕", 11), pady=15)
label.pack()

# 비밀번호 입력창
entry = tk.Entry(root, font=("맑은 고딕", 12), show="*", justify="center", width=15)
entry.pack()
entry.focus()

# 마우스로 누를 확인 버튼
button = tk.Button(root, text="확인", font=("맑은 고딕", 11), command=check_password, width=10, bg="#dddddd")
button.pack(pady=15)

# 엔터키를 눌러도 확인 버튼을 누른것과 같이
root.bind('<Return>', lambda event: check_password())

# 프로그램 창 계속 띄워두기
root.mainloop()
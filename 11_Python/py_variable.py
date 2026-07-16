import sys # 객체의 메모리 할당 크기 계산 라이브러리
import psutil # 프로그램 전체의 메모리 사용량 확인
import os # os 기능 제어 명령어

num = 10
text = "Hello"
arr = [1, 2, 3]

print(sys.getsizeof(num))   # 정수 10이 차지하는 메모리 (28 바이트)
print(sys.getsizeof(text))  # 문자열이 차지하는 메모리 (54 바이트)
print(sys.getsizeof(arr))   # 리스트 배열이 차지하는 메모리 (88 바이트)

x = 10             # int
y = 3.14           # float
name = "Python"    # str
is_fun = True      # bool
colors = ["red", "green", "blue"]    # list
coords = (10, 20)                    # tuple
person = {"name": "Tom", "age": 30}  # dict
nums = {1, 2, 3}   # set
nothing = None     # NoneType

print(type(x))             # <class 'int'>
print(isinstance(x, int))  # True

a = [1, 2, 3]
print(id(a))        # 10진수 주소 출력 (예: 2135678453440)
print(hex(id(a)))   # 16진수 메모리 주소 출력 (예: 0x1f148b30f80)

pid = os.getpid()
py_process = psutil.Process(pid)
memory_usage = py_process.memory_info().rss / (1024 * 1024) # MB 단위 변환

print(f"현재 파이썬 프로그램의 메모리 사용량: {memory_usage:.2f} MB")

# 참고 : 프로그램 전체의 메모리 사용량 확인
# pip install psutil
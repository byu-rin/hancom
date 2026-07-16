# Python 3.6+ 에서 사용가능한 문자열 포맷 방식.
# 문자열 앞에 f붙이고 {}

name = "King"
age = 99

# 기존 방식 (불편함)
print("저는", name, "입니다. 나이는", age, "살입니다.")

# f-string 방식 (권장)
print(f"저는 {name}입니다. 나이는 {age}살입니다.")

a = 5
b = 3
print(f"{a} + {b} = {a + b}")       # 5 + 3 = 8
print(f"소수점 2자리: {3.14159:.2f}") # 3.14

name = "King"
age = 99

# { } 자리에 순서대로 채움
print("저는 {}입니다. 나이는 {}살입니다.".format(name, age))
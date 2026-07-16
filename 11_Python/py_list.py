# 순서 있음. 수정가능. 중복허용하는 자료형 list

colors = ["red", "green", "blue"]

print(colors[0])    # red    (첫 번째)
print(colors[-1])   # blue   (마지막)
print(colors[0:2])  # ['red', 'green']  (슬라이싱)

colors[-1] = "black"         # 값 변경
colors.append("pink")        # 끝에 추가
colors.insert(0, "white")    # 특정 위치에 삽입
colors.remove("white")       # 값으로 제거

numbers = [8, 5, 3, 2, 7]
numbers.sort()               # 오름차순 정렬
numbers.sort(reverse=True)   # 내림차순 정렬
numbers.reverse()            # 순서 뒤집기
print(2 in numbers)          # True (포함 여부)
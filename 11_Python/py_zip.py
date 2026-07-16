# zip() — 두 리스트 짝지어 묶기 (java map 과 비슷)
# 이름과 점수가 따로 떨어진 두 리스트를, 지퍼처럼 한 칸씩 같은 자리끼리 맞물려 한 쌍으로 묶어주는 함수


# 1. for 문 한번 돌때맏 name, score 한쌍을 받음
names = ["뽀삐", "초코", "쿠키"]
scores = [95, 88, 72]

for name, score in zip(names, scores):
    print(f"{name}: {score}점")


# 2. for문 없이 : List(zip) -> (이름, 점수) 튜플 리스트로 출력
names = ["뽀삐", "초코", "쿠키"]
scores = [95, 88, 72]

pairs = list(zip(names, scores))
print(pairs)

# 3. 한 줄에 딕셔너리
keys = ["이름", "나이", "직업"]
values = ["홍길동", 30, "개발자"]

person = dict(zip(keys, values))
print(person)
# {'이름': '홍길동', '나이': 30, '직업': '개발자'}
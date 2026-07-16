import pyfiglet

sentence = pyfiglet.figlet_format("Hello", font='3-d')
print(sentence)

# 텍스트를 아스키아트로 변환하는 외부 라이브러리
# figlet_format 함수에 문자열 넘기면 아스키아트로 출력
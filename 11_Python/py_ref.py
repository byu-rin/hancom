import pyfiglet

def good_sentence(sentence: str) -> None:
    """
    입력된 문자열을 pyfiglet 형식으로 출력합니다.
    매개변수: sentence (str)
    반환: None — 출력만 수행
    """
    py_sentence = pyfiglet.figlet_format(sentence)
    print(py_sentence)

good_sentence("GOOD")

#독스트링("""...""") — 함수 첫 줄에 적는 설명서, 역할·매개변수·반환값을 기록
# 매개변수 타입 힌트(: str) — 받을 값의 자료형 표시, 잘못된 타입 사용을 미리 알려 주는 안내판
# 반환 타입 힌트(-> int) — 함수가 돌려줄 값의 자료형 표시, def 줄 끝에 화살표(->)로 적음
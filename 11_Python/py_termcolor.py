import pyfiglet
from termcolor import colored

py_text = pyfiglet.figlet_format("Hello")
color_text = colored(py_text, "yellow", "on_blue", ["bold"])
print(color_text)


# colored(문자열, 글자색, 배경색, attrs=[스타일])
result = colored("Hello", "red", "on_green", ["bold"])
print(result)
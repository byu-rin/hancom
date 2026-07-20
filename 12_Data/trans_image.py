from PIL import Image, ImageEnhance, ImageOps
import matplotlib.pyplot as plt

# [1단계] 이미지 불러오기 — PNG·JPG·JPEG 모두 가능
img = Image.open("cat_img.jpg")
img = img.convert("RGB")

# [2단계] 회전 — 90도 시계 방향
img_rotated = img.rotate(90)

# [3단계] 밝기 조절 — 0.5 = 원본의 50%
enhancer = ImageEnhance.Brightness(img)
img_brightness = enhancer.enhance(0.5)

# [4단계] 좌우 반전 — 거울처럼 뒤집기
img_flip = ImageOps.mirror(img)

# [5단계] 저장 — 변환된 이미지 3장 출력
img_rotated.save("./img_rotated.jpg")
img_brightness.save("./img_brightness.jpg")
img_flip.save("./img_flip.jpg")

print("이미지 저장이 잘 됐습니다.")
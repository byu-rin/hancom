const img_a = "https://picsum.photos/96?random=1";
const img_b = "https://picsum.photos/96?random=2";
const img_c = "https://picsum.photos/96?random=3";
const img_d = "https://picsum.photos/96?random=4";

// 1. 페이지의 그림(id="pic")을 찾아 myImage 상자에 담기
const myImage = document.querySelector("#pic");
// 2. 처음 보여 줄 그림을 IMG_A로 정하기
myImage.setAttribute("src", img_a);

// 3. 그림을 클릭할 때마다 실행 (onclick 속성에 화살표 함수 연결)
myImage.onclick = () => {
  // 지금 걸려 있는 그림 주소를 읽어오기 (getAttribute)
  const mySrc = myImage.getAttribute("src");

  if (mySrc === img_a) {
    myImage.setAttribute("src", img_b);
  } else if (mySrc === img_b) {
    myImage.setAttribute("src", img_c);
  } else if (mySrc === img_c) {
    myImage.setAttribute("src", img_d);
  } else {
    myImage.setAttribute("src", img_a);
  }
};

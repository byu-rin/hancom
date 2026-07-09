// 1. 누른 횟수를 셀 상자 n을 0으로 시작 (값이 변하니 let)
let n = 0;

// 2. 버튼과 횟수 표시 칸을 찾아 담기
const btn = document.querySelector("#btn");
const out = document.querySelector("#count");

// 3. 버튼이 클릭될 때마다(이벤트) 실행 (화살표 함수)
btn.addEventListener("click", () => {
  n++;
  out.textContent = `${n}번 눌렀어요`;
});

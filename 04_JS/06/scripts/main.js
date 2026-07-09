// 1. 선택 목록(flavor)과 결과 문장(result)을 찾아 담기
const flavor = document.querySelector("#flavor");
const result = document.querySelector("#result");

// 2. "확인" 버튼을 클릭하면 조건을 판단 (화살표 함수)
document.querySelector("#check").addEventListener("click", () => {
  if (flavor.value === "chocolate") {
    result.textContent = "빠삐코";
  } else if (flavor.value === "vanila") {
    result.textContent = "와";
  } else {
    result.textContent = "사빠딸";
  }
});

// 1. 입력칸·목록·버튼을 찾아 담기
const n = document.querySelector("#n");
const out = document.querySelector("#out");

// 2. "반복" 버튼 — for로 1부터 N까지 반복 (화살표 함수)
document.querySelector("#run").addEventListener("click", () => {
  out.innerHTML = ""; // 목록 비우기
  const count = Number(n.value);

  // for (시작값; 계속할 조건; 매번 변화) — 반복문은 ES6에서도 그대로 씀
  for (let i = 1; i <= count; i++) {
    const li = document.createElement("li");
    li.textContent = `${i}번째 🍎`; // 1~count까지 반복 출력
    out.appendChild(li);
  }
});

// 3. "카운트다운" 버튼 — while로 N부터 1까지
document.querySelector("#down").addEventListener("click", () => {
  out.innerHTML = "";
  let i = Number(n.value);
  // while (조건): 조건이 참인 동안 반복
  while (i > 0) {
    const li = document.createElement("li");
    li.textContent = i; // count부터 1까지
    out.appendChild(li);
    i--;
  }
});

/**
 * @name loopFor
 * @description [for] 세 가지(초기화·조건·증감)가 () 안 한 줄에 모여 실행되는 반복문입니다.
 * @version ES6에서도 그대로 사용
 *
 * @param {statement} 초기화식 - 시작값 설정 (예: let i = 0;)
 * @param {boolean} 종료조건 - 계속할 조건 설정 (참일 때 실행, 거짓이면 종료)
 * @param {statement} 증감식 - 매번 늘릴 양 설정. i++는 i = i + 1과 같음
 *
 * @example
 * for (let i = 0; i < 5; i++) {
 *   // 실행할 코드 (5번 반복)
 * }
 */
function loopForExample() {
  for (let i = 0; i < 5; i++) {
    console.log(i);
  }
}

/**
 * @name loopWhile
 * @description [while] 조건이 참인 동안 반복되는 문법입니다.
 * 세 가지 요소가 흩어져 있습니다. (초기화는 외부 위쪽, 증감은 본문 내부)
 * @version ES6에서도 그대로 사용
 *
 * @param {boolean} 종료조건 - 반복을 계속할 조건문
 * @warning ⚠️ 본문 안에서 조건을 바꾸지(증감식 누락) 않으면 무한반복에 빠지므로 주의해야 합니다.
 *
 * @example
 * let i = 0; // 1. 초기화식
 * while (i < 5) { // 2. 종료 조건
 *   // 실행할 코드
 *   i++; // 3. 증감식 (이 부분이 없으면 무한반복)
 * }
 */
function loopWhileExample() {
  let i = 0;
  while (i < 5) {
    console.log(i);
    i++;
  }
}

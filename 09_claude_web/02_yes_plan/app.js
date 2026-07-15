// ===== 👑 공주 계산기 로직 =====

// --- DOM 참조 ---
const displayEl = document.getElementById("display");
const expressionEl = document.getElementById("expression");
const keysEl = document.getElementById("keys");
const historyEl = document.getElementById("history");
const clearHistoryBtn = document.getElementById("clear-history");

// 연산자 → 화면 표시 기호 매핑
const OP_SYMBOL = { "+": "+", "-": "−", "*": "×", "/": "÷" };

// --- 상태 모델 ---
// current : 현재 입력/표시 중인 값(문자열)
// previous: 연산자 앞에 확정된 피연산자(문자열 or null)
// operator: 대기 중인 연산자(+,-,*,/ or null)
// overwrite: true면 다음 숫자 입력 시 current를 덮어씀(결과/연산자 직후)
let state = {
  current: "0",
  previous: null,
  operator: null,
  overwrite: true,
};

const MAX_HISTORY = 10;
const history = [];

// ===== 부동소수점 오차 정리 (필수) =====
// 0.1 + 0.2 = 0.30000000000000004 같은 오차를 12자리에서 반올림해 제거
function roundResult(n) {
  if (!isFinite(n)) return n;
  const rounded = Math.round((n + Number.EPSILON) * 1e12) / 1e12;
  // Number 재변환으로 불필요한 0 제거 (0.30 → 0.3)
  return Number(rounded);
}

// 실제 사칙연산 수행
function calc(a, op, b) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? null : a / b; // 0으로 나누기 → null(에러 신호)
    default: return b;
  }
}

// 표시용 숫자 포맷 (지수표기 방지 + 자릿수 제한)
function formatNumber(n) {
  if (!isFinite(n)) return "오류";
  // 아주 큰/작은 수는 지수표기 대신 유효자릿수로 축약
  if (Math.abs(n) >= 1e15 || (n !== 0 && Math.abs(n) < 1e-9)) {
    return Number(n.toPrecision(12)).toExponential();
  }
  return String(n);
}

// ===== 렌더링 =====
function render() {
  displayEl.textContent = state.current;
  const prev = state.previous ?? "";
  const op = state.operator ? " " + OP_SYMBOL[state.operator] : "";
  expressionEl.textContent = (prev + op).trim();
}

function showError(msg) {
  displayEl.textContent = msg;
  displayEl.classList.add("error");
  expressionEl.textContent = "";
  // 상태 초기화
  state = { current: "0", previous: null, operator: null, overwrite: true };
}

function clearError() {
  displayEl.classList.remove("error");
}

// ===== 입력 핸들러들 =====
function inputNumber(digit) {
  clearError();
  if (state.overwrite) {
    state.current = digit;
    state.overwrite = false;
  } else {
    // 선행 0 방지 ("0" 뒤에 숫자 오면 교체)
    state.current = state.current === "0" ? digit : state.current + digit;
  }
  render();
}

function inputDecimal() {
  clearError();
  if (state.overwrite) {
    state.current = "0.";
    state.overwrite = false;
  } else if (!state.current.includes(".")) {
    state.current += ".";
  }
  render();
}

// 대기 중 연산이 있으면 먼저 계산, 이어서 새 연산자 설정
function chooseOperator(op) {
  clearError();

  // 이미 연산자가 있고 방금 숫자를 안 눌렀으면(overwrite) 연산자만 교체
  if (state.operator && state.overwrite) {
    state.operator = op;
    render();
    return;
  }

  if (state.previous === null) {
    state.previous = state.current;
  } else if (!state.overwrite) {
    // 연속 연산: previous op current 계산
    const result = compute();
    if (result === null) return; // 에러 처리됨
    state.previous = result;
  }

  state.operator = op;
  state.overwrite = true;
  render();
}

// previous, operator, current로 계산해서 결과 문자열 반환 (에러면 null)
function compute() {
  const a = parseFloat(state.previous);
  const b = parseFloat(state.current);
  const raw = calc(a, state.operator, b);

  if (raw === null) {
    showError("0으로는 못 나눠요 💦");
    return null;
  }
  return formatNumber(roundResult(raw));
}

function equals() {
  clearError();
  if (state.operator === null || state.previous === null) return;

  const exprText =
    state.previous + " " + OP_SYMBOL[state.operator] + " " + state.current;

  const result = compute();
  if (result === null) return; // 0으로 나누기 등

  addHistory(exprText, result);

  state.current = result;
  state.previous = null;
  state.operator = null;
  state.overwrite = true;
  expressionEl.textContent = exprText + " =";
  displayEl.textContent = result;
}

function clearAll() {
  clearError();
  state = { current: "0", previous: null, operator: null, overwrite: true };
  render();
}

function backspace() {
  clearError();
  if (state.overwrite) return; // 결과/연산자 직후엔 무시
  if (state.current.length <= 1 || (state.current.length === 2 && state.current.startsWith("-"))) {
    state.current = "0";
    state.overwrite = true;
  } else {
    state.current = state.current.slice(0, -1);
  }
  render();
}

function percent() {
  clearError();
  const value = roundResult(parseFloat(state.current) / 100);
  state.current = formatNumber(value);
  state.overwrite = true;
  render();
}

function negate() {
  clearError();
  if (state.current === "0") return;
  state.current = state.current.startsWith("-")
    ? state.current.slice(1)
    : "-" + state.current;
  render();
}

// ===== 계산 기록 =====
function addHistory(expr, result) {
  history.unshift({ expr, result });
  if (history.length > MAX_HISTORY) history.pop();
  renderHistory();
}

function renderHistory() {
  historyEl.innerHTML = "";
  for (const item of history) {
    const li = document.createElement("li");
    li.innerHTML =
      `<span class="eq-expr">${item.expr} =</span> ` +
      `<span class="eq-result">${item.result}</span>`;
    historyEl.appendChild(li);
  }
}

// ===== 이벤트 위임 (클릭) =====
keysEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button.key");
  if (!btn) return;
  dispatch(btn.dataset.action, btn.dataset.value);
});

clearHistoryBtn.addEventListener("click", () => {
  history.length = 0;
  renderHistory();
});

// action 분기 (클릭/키보드 공용)
function dispatch(action, value) {
  switch (action) {
    case "number": inputNumber(value); break;
    case "decimal": inputDecimal(); break;
    case "operator": chooseOperator(value); break;
    case "equals": equals(); break;
    case "clear": clearAll(); break;
    case "backspace": backspace(); break;
    case "percent": percent(); break;
    case "negate": negate(); break;
  }
}

// ===== 키보드 핸들러 (필수) =====
document.addEventListener("keydown", (e) => {
  const k = e.key;
  let action = null;
  let value = null;

  if (k >= "0" && k <= "9") { action = "number"; value = k; }
  else if (k === ".") { action = "decimal"; }
  else if (k === "+" || k === "-" || k === "*" || k === "/") { action = "operator"; value = k; }
  else if (k === "Enter" || k === "=") { action = "equals"; e.preventDefault(); }
  else if (k === "Escape") { action = "clear"; }
  else if (k === "Backspace") { action = "backspace"; }
  else if (k === "%") { action = "percent"; }
  else return; // 처리 안 하는 키는 무시

  dispatch(action, value);
  flashKey(action, value);
});

// 눌린 키에 대응하는 화면 버튼을 잠깐 강조
function flashKey(action, value) {
  const selector = value
    ? `.key[data-action="${action}"][data-value="${cssEscape(value)}"]`
    : `.key[data-action="${action}"]`;
  const btn = keysEl.querySelector(selector);
  if (!btn) return;
  btn.classList.add("active");
  setTimeout(() => btn.classList.remove("active"), 120);
}

// data-value 속성 선택자용 이스케이프 (예: 백슬래시/따옴표 대비)
function cssEscape(v) {
  return v.replace(/["\\]/g, "\\$&");
}

// 초기 렌더
render();
renderHistory();

// ── State ──────────────────────────────────────────────────────────────────
const state = {
  current: '0',
  previous: null,
  operator: null,
  waitingForOperand: false,
  expression: '',
};

// ── DOM refs ────────────────────────────────────────────────────────────────
const displayEl   = document.getElementById('display');
const expressionEl = document.getElementById('expression');
const ballContainer = document.getElementById('ball-container');

// ── SEED brand colors (5개) ─────────────────────────────────────────────────
const BALL_COLORS = [
  'oklch(0.696 0.204 43)',   // carrot-600
  'oklch(0.606 0.205 258)',  // blue-700
  'oklch(0.585 0.115 170)',  // green-700
  'oklch(0.640 0.233 28)',   // red-700
  'oklch(0.898 0.141 95)',   // yellow-300
];

// ── Display update ──────────────────────────────────────────────────────────
function updateDisplay(value) {
  const formatted = formatNumber(value);
  displayEl.textContent = formatted;
  displayEl.classList.toggle('shrink', formatted.length > 9);
}

function formatNumber(value) {
  if (value === 'Error') return 'Error';
  const num = parseFloat(value);
  if (isNaN(num)) return '0';
  // 소수점 최대 10자리
  const str = parseFloat(num.toPrecision(10)).toString();
  return str;
}

// ── Calculator logic ────────────────────────────────────────────────────────
function calculate(a, b, op) {
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  switch (op) {
    case '+': return numA + numB;
    case '-': return numA - numB;
    case '*': return numA * numB;
    case '/':
      if (numB === 0) return 'Error';
      return numA / numB;
    default: return numB;
  }
}

function handleDigit(digit) {
  if (state.waitingForOperand) {
    state.current = digit;
    state.waitingForOperand = false;
  } else {
    state.current = state.current === '0' ? digit : state.current + digit;
  }
  updateDisplay(state.current);
}

function handleDecimal() {
  if (state.waitingForOperand) {
    state.current = '0.';
    state.waitingForOperand = false;
    updateDisplay(state.current);
    return;
  }
  if (!state.current.includes('.')) {
    state.current += '.';
    updateDisplay(state.current);
  }
}

function handleOperator(op) {
  const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };

  if (state.operator && !state.waitingForOperand) {
    const result = calculate(state.previous, state.current, state.operator);
    if (result === 'Error') {
      state.current = 'Error';
      state.expression = 'Error';
      state.operator = null;
      state.previous = null;
      updateDisplay('Error');
      expressionEl.textContent = '';
      return;
    }
    state.current = String(parseFloat(result.toPrecision(10)));
    updateDisplay(state.current);
  }

  state.previous = state.current;
  state.operator = op;
  state.waitingForOperand = true;
  state.expression = formatNumber(state.current) + ' ' + opSymbols[op];
  expressionEl.textContent = state.expression;

  // 활성 연산자 버튼 표시
  document.querySelectorAll('.btn-operator').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.btn-operator').forEach(btn => {
    if (btn.dataset.value === op) btn.classList.add('active');
  });
}

function handleEquals() {
  if (state.operator === null || state.waitingForOperand) return;

  const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  const exprText = formatNumber(state.previous) + ' ' + opSymbols[state.operator] + ' ' + formatNumber(state.current) + ' =';

  const result = calculate(state.previous, state.current, state.operator);

  if (result === 'Error') {
    state.current = 'Error';
    expressionEl.textContent = exprText;
    updateDisplay('Error');
  } else {
    state.current = String(parseFloat(result.toPrecision(10)));
    expressionEl.textContent = exprText;
    updateDisplay(state.current);
  }

  state.operator = null;
  state.previous = null;
  state.waitingForOperand = true;

  document.querySelectorAll('.btn-operator').forEach(btn => btn.classList.remove('active'));

  // 당구공 애니메이션 실행
  launchBalls();
}

function handleClearAll() {
  state.current = '0';
  state.previous = null;
  state.operator = null;
  state.waitingForOperand = false;
  state.expression = '';
  updateDisplay('0');
  expressionEl.textContent = '';
  document.querySelectorAll('.btn-operator').forEach(btn => btn.classList.remove('active'));
}

function handleToggleSign() {
  if (state.current === '0' || state.current === 'Error') return;
  state.current = state.current.startsWith('-')
    ? state.current.slice(1)
    : '-' + state.current;
  updateDisplay(state.current);
}

function handlePercent() {
  const val = parseFloat(state.current);
  if (isNaN(val)) return;
  state.current = String(val / 100);
  updateDisplay(state.current);
}

// ── Event delegation ────────────────────────────────────────────────────────
document.querySelector('.keypad').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const action = btn.dataset.action;
  const value  = btn.dataset.value;

  switch (action) {
    case 'digit':      handleDigit(value); break;
    case 'decimal':    handleDecimal(); break;
    case 'operator':   handleOperator(value); break;
    case 'equals':     handleEquals(); break;
    case 'clear-all':  handleClearAll(); break;
    case 'toggle-sign': handleToggleSign(); break;
    case 'percent':    handlePercent(); break;
  }
});

// ── Billiard ball animation ─────────────────────────────────────────────────
function launchBalls() {
  // 기존 공 제거
  ballContainer.innerHTML = '';

  const W = window.innerWidth;
  const H = window.innerHeight;
  const BALL_SIZE = 30;
  const DURATION = 3000;   // 3초
  const FADE_DURATION = 400;

  // 4 모서리 시작 위치
  const corners = [
    { x: 0,             y: 0 },
    { x: W - BALL_SIZE, y: 0 },
    { x: 0,             y: H - BALL_SIZE },
    { x: W - BALL_SIZE, y: H - BALL_SIZE },
    // 5번째는 무작위 모서리
    null,
  ];

  // 마지막 하나는 랜덤 모서리로
  corners[4] = corners[Math.floor(Math.random() * 4)];

  BALL_COLORS.forEach((color, i) => {
    const corner = corners[i];

    // 초기 속도: 모서리에서 안쪽 방향 + 약간의 랜덤
    const baseSpeed = 4 + Math.random() * 3; // px/frame
    const angle = getAngleFromCorner(corner, W, H, BALL_SIZE);
    let vx = Math.cos(angle) * baseSpeed;
    let vy = Math.sin(angle) * baseSpeed;

    let x = corner.x;
    let y = corner.y;

    // DOM 생성
    const ball = document.createElement('div');
    ball.className = 'ball';
    ball.style.backgroundColor = color;
    ball.style.left = x + 'px';
    ball.style.top  = y + 'px';
    ballContainer.appendChild(ball);

    const startTime = performance.now();
    let rafId;

    function tick(now) {
      const elapsed = now - startTime;

      if (elapsed >= DURATION - FADE_DURATION) {
        ball.classList.add('fade-out');
      }

      if (elapsed >= DURATION) {
        cancelAnimationFrame(rafId);
        ball.remove();
        return;
      }

      // 이동
      x += vx;
      y += vy;

      // 벽 반사
      if (x <= 0) {
        x = 0;
        vx = Math.abs(vx);
      } else if (x + BALL_SIZE >= W) {
        x = W - BALL_SIZE;
        vx = -Math.abs(vx);
      }

      if (y <= 0) {
        y = 0;
        vy = Math.abs(vy);
      } else if (y + BALL_SIZE >= H) {
        y = H - BALL_SIZE;
        vy = -Math.abs(vy);
      }

      ball.style.left = x + 'px';
      ball.style.top  = y + 'px';

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
  });
}

/**
 * 모서리에 따라 안쪽을 향하는 초기 각도 계산
 * 0도 = 오른쪽, 시계 방향
 */
function getAngleFromCorner(corner, W, H, size) {
  const isLeft  = corner.x === 0;
  const isTop   = corner.y === 0;

  // 각 모서리에서 반대 방향 ±40도 랜덤
  const spread = (Math.random() - 0.5) * (Math.PI / 2.2); // ±~40deg

  if (isLeft && isTop) {
    // 우하향: 45도 기준
    return Math.PI / 4 + spread;
  } else if (!isLeft && isTop) {
    // 좌하향: 135도 기준
    return (3 * Math.PI) / 4 + spread;
  } else if (isLeft && !isTop) {
    // 우상향: -45도 기준
    return -Math.PI / 4 + spread;
  } else {
    // 좌상향: -135도 기준
    return (-3 * Math.PI) / 4 + spread;
  }
}

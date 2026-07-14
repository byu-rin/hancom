const Alert = ({ type, text, onToggle }) => {
  // log test
  const handleTest = (buttonName) => {
    console.log(`테스트] ${buttonName} 버튼이 클릭되었습니다`);
  };

  const map = {
    success: { icon: "✅", color: "green" },
    error: { icon: "❌", color: "crimson" },
    warning: { icon: "⚠️", color: "orange" },
  };

  // 현재 타입에 맞는 아이콘과 색상
  const currentStyle = map[type];

  return (
    <div className="Alert-box">
      <h1 style={{ color: currentStyle.color }}>
        {currentStyle.icon} {text}
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <button
          type="button"
          className="toggle-btn-success"
          onClick={() => {
            handleTest("success");
            onToggle("success");
          }}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          success
        </button>

        <button
          type="button"
          className="toggle-btn-error"
          onClick={() => {
            handleTest("error");
            onToggle("error");
          }}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          error
        </button>

        <button
          type="button"
          className="toggle-btn-warning"
          onClick={() => {
            handleTest("warning");
            onToggle("warning");
          }}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          warning
        </button>
      </div>
    </div>
  );
};
export default Alert;

/*
오늘의 메모 - react 데이터 흐름 / 이벤트
⭐⭐⭐ 1. `useState` 는 배열을 반환한다 -> 반드시 구조분해할것
const [value, setValue] = useState(초기값) (o)
const value = useState(초기값) (x/배열 그대로 담김 ㅠ)
2. 단방향 데이터 흐름 : 부모 -> 자식은 props, 자식 -> 부모는 함수 호출(콜백)
자식이 버튼 클릭 시 onToggle(...)을 부르면, 부모의 setState 실행
*/

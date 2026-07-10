const Badge = ({ text, type, onToggle }) => {
  const color = type === "new" ? "green" : "crimson";

  // log test
  const handleTest = (buttonName) => {
    console.log(`테스트] ${buttonName} 버튼이 클릭되었습니다`);
  };

  return (
    <div className="Badge-box">
      <h1 style={{ color: "#fff" }}>
        <span style={{ background: color, padding: "4px 8px" }}>{text}</span>
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          marginTop: "15px",
        }}
      ></div>
      <button
        type="button"
        className="toggle-btn-new"
        onClick={() => {
          handleTest("new");
          onToggle("new");
        }}
        style={{ padding: "8px 16px", cursor: "pointer" }}
      >
        type="new"
      </button>
      <button
        type="button"
        className="toggle-btn-hot"
        onClick={() => {
          handleTest("hot");
          onToggle("hot");
        }}
        style={{ padding: "8px 16px", cursor: "pointer" }}
      >
        type="hot"
      </button>
    </div>
  );
};

export default Badge;

// text 가 new이면 span bg green, hot이면 bg red

/*
단방향 데이터 흐름과 역방향 이벤트 트리거
1. 클릭 이벤트 발생
2. 자식 버튼의 onToggle("hot") 인자를 담아 부모 함수 원격 호출
3. 부모의 clickedType 이 hot 으로 바뀜
4. 부모 상태가 바뀌었으므로 전체 화면 렌더링
*/

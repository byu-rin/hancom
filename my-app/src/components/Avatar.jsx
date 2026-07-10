// Avatar 라는 이름의 함수형 컴포넌트.
// 외부(부모)에서 name, online, onToggle이라는 3개의 데이터를 파라미터(props)로 받아옵니다.
const Avatar = ({ name, online, onToggle }) => {
  // 렌더링할 HTML 구조 반환
  return (
    <div className="avatar-box">
      {/*online 값 따라 글자 색 동적변경*/}
      <h1 style={{ color: online ? "#2ecc71" : "#95a5a6" }}>
        {/*name출력, online 상태에 따라 온라인 또는 오프라인 글자를 화면에 렌더링*/}
        {name} ({online ? "온라인" : "오프라인"})
      </h1>

      {/* 리액트 단축평가. online 이 참일때만 이모지 호출 */}
      {online && <span className="dot">🟢</span>}

      {/* 일반적인 버튼 태그 생성. onclick 시 부모가 넘겨준 onToggle 함수 실행 예약 */}
      <button type="button" className="toggle-btn" onClick={onToggle}>
        {/* online true 시 버튼 글자 로그아웃. 로그아웃 시 버튼 글자 로그인 */}
        {online ? "로그아웃" : "로그인"}
      </button>
    </div>
  );
};

export default Avatar;

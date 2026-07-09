const Avatar = ({ name, online, onToggle }) => {
  return (
    <div className="avatar-box">
      <h1 style={{ color: online ? "#2ecc71" : "#95a5a6" }}>
        {name} ({online ? "온라인" : "오프라인"})
      </h1>

      {online && <span className="dot">🟢</span>}

      <button type="button" className="toggle-btn" onClick={onToggle}>
        {online ? "로그아웃" : "로그인"}
      </button>
    </div>
  );
};
export default Avatar;

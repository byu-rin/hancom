import { useState } from "react";
import Avatar from "./components/Avatar.jsx";
import "./App.css";

const App = () => {
  // 1. 지니와 철수의 온라인 상태를 useState 로 만들어 관리
  const [isJiniOnline, setIsjiniOnline] = useState(true);
  const [isChulsooOnline, setIsChulsooOnline] = useState(false);

  return (
    <>
      {/*2. 상태값과, 그 상태를 반대로 바구는 함수를 Props 로 전달 */}
      <Avatar
        name="지니"
        online={isJiniOnline}
        onToggle={() => setIsjiniOnline(!isJiniOnline)}
      />
      <Avatar
        name="철수"
        online={isChulsooOnline}
        onToggle={() => setIsChulsooOnline(!isChulsooOnline)}
      />
    </>
  );
};

export default App;

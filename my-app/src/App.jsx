import { useState } from "react";
import Avatar from "./components/Avatar.jsx";
import Badge from "./components/Badge.jsx";
import Alert from "./components/Alert.jsx";
import Rating from "./components/Rating.jsx";
import Tag from "./components/Tag.jsx";
import SubmitButton from "./components/SubmitButton";
import Counter from "./components/Counter.jsx";
import Counter2 from "./components/Counter2.jsx";
import NameForm from "./components/NameForm.jsx";

import "./App.css";

const App = () => {
  // 1. 지니와 철수의 온라인 상태를 useState 로 만들어 관리
  const [isJiniOnline, setIsjiniOnline] = useState(true);
  const [isChulsooOnline, setIsChulsooOnline] = useState(false);

  const [currentType, setCurrentType] = useState("new");
  const text = currentType === "new" ? "NEW" : "HOT";

  const [alertType, setAlertType] = useState("success");
  const textMapping = {
    success: "성공했습니다",
    error: "실패했습니다",
    warning: "주의하세요",
  };
  const currentText = textMapping[alertType];

  const list = ["react", "props", "map"];

  return (
    <>
      {/*2. 상태값과, 그 상태를 반대로 바꾸는 함수를 Props 로 전달 */}
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
      <br></br>
      <br></br>
      <Badge
        text={text}
        type={currentType}
        onToggle={(clickedType) => setCurrentType(clickedType)}
      />
      <br></br>
      <br></br>
      <Alert
        type={alertType}
        text={currentText}
        onToggle={(clickedType) => setAlertType(clickedType)}
      />
      <br></br>
      <br></br>
      <Rating score={3} />
      <br></br>
      <br></br>
      <Tag tags={list} />
      <br></br>
      <br></br>
      <SubmitButton />
      <br></br>
      <br></br>
      <Counter />
      <br></br>
      <br></br>
      <Counter2 />
      <br></br>
      <br></br>
      <NameForm />
    </>
  );
};

export default App;

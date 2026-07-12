// 용어 데이터 배열

export const terms = [
  {
    id: "component",
    name: "컴포넌트",
    category: "기초",
    short: "화면을 만드는 재사용 부품",
    description:
      "컴포넌트는 UI를 만드는 독립적인 부품입니다. 함수 이름은 대문자로 시작하고, JSX를 반환합니다. 작은 부품을 조립해서 큰 화면을 만듭니다.",
    example: "function Hello() { return <h1>안녕!</h1> }",
  },
  {
    id: "props",
    name: "Props",
    category: "데이터 전달",
    short: "부모가 자식에게 주는 값",
    description:
      "props는 부모 컴포넌트가 자식 컴포넌트에게 전달하는 읽기 전용 데이터입니다. 함수의 인자처럼 받아서 사용하고, 자식이 직접 바꿀 수 없습니다.",
    example: '<Avatar name="지니" online={true} />',
  },
  {
    id: "usestate",
    name: "useState",
    category: "훅",
    short: "바뀌는 값을 기억하는 훅",
    description:
      "useState는 컴포넌트 안에서 바뀌는 값(상태)을 기억하는 훅입니다. [값, 바꾸는함수] 쌍을 돌려주며, 바꾸는 함수를 호출하면 화면이 다시 그려집니다.",
    example: "const [count, setCount] = useState(0)",
  },
  {
    id: "map-key",
    name: "map + key",
    category: "렌더링",
    short: "배열을 화면 목록으로 변환",
    description:
      "배열의 map으로 데이터 하나하나를 JSX로 바꿔 목록을 그립니다. 각 항목에는 고유한 key를 줘야 React가 어떤 항목이 바뀌었는지 알 수 있습니다.",
    example: "list.map((item) => <li key={item.id}>{item.name}</li>)",
  },
  {
    id: "router",
    name: "Router",
    category: "라우팅",
    short: "주소에 따라 페이지 전환",
    description:
      "react-router-dom은 주소(URL)에 따라 다른 컴포넌트를 보여줍니다. BrowserRouter로 감싸고, Routes/Route로 주소와 페이지를 연결하며, Link로 이동합니다.",
    example: '<Route path="/term/:id" element={<TermPage />} />',
  },
];

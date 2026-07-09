// 1. 관련된 값을 "이름표: 값" 쌍으로 묶어 person 객체 만들기
const person = {
  name: "콩이",
  age: 10,
};

// 2. 결과 칸을 찾아 담기
const out = document.querySelector("#out");

// 3. 객체 값을 화면에 그림
const render = () => {
  out.textContent = `${person.name} (${person.age}살)`;
};
render();

document.querySelector("#up").addEventListener("click", () => {
  person.age++;
  render();
});

document.querySelector("#rename").addEventListener("click", () => {
  person.name = "두부";
  render();
});

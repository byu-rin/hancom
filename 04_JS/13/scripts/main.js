let fruits = ["사과", "바나나"];

const fruit = document.querySelector("#fruit");
const out = document.querySelector("#out");
const info = document.querySelector("#info");

const render = () => {
  out.textContent = fruits.join(", ");
  info.textContent = `개수(length): ${fruits.length}`;
};
render();

// 추가 버튼 - 입력한 과일을 배열 끝에 push
document.querySelector("#add").addEventListener("click", () => {
  if (!fruit.value) {
    return;
  } // 비어있으면
  fruits.push(fruit.value); // .push(값): 배열 끝 새 값
  fruit.value = ""; // 입력칸 비우기
  render();
});

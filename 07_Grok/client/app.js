const form = document.getElementById("chat-form");
const input = document.getElementById("q");
const btn = document.getElementById("btn");
const messages = document.getElementById("messages");

// 말풍선 하나를 만들어 messages 안에 추가하고, 항상 최신 메시지가 보이게 스크롤 내림
// textContent를 쓰기 때문에 사용자가 입력한 내용이 HTML로 실행되지 않음 (XSS 방지)
function addMessage(text, type) {
  const bubble = document.createElement("div");
  bubble.className = `msg ${type}`;
  bubble.textContent = text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
  return bubble;
}

// AI가 답변을 준비 중일 때 보여줄 점 3개짜리 말풍선
function addTypingIndicator() {
  const bubble = document.createElement("div");
  bubble.className = "msg typing";
  bubble.innerHTML = "<span></span><span></span><span></span>";
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
  return bubble;
}

// '보내기' 버튼 클릭 또는 입력창에서 Enter 입력 시 실행됨 (form submit)
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const prompt = input.value.trim();
  if (!prompt) return;

  // 내가 보낸 질문을 화면에 바로 표시
  addMessage(prompt, "user");
  input.value = "";

  // 응답 오는 동안 입력 막기 + 로딩 표시
  input.disabled = true;
  btn.disabled = true;
  const typingBubble = addTypingIndicator();

  fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })
    .then((res) => res.json())
    .then((data) => {
      typingBubble.remove();
      addMessage(data.reply || data.error || "(응답 없음)", "bot");
    })
    .catch(() => {
      typingBubble.remove();
      addMessage("❌ 서버 안 켜짐? (server서 node index.js 먼저)", "error");
    })
    .finally(() => {
      input.disabled = false;
      btn.disabled = false;
      input.focus();
    });
});

require("dotenv").config();
const key = process.env.GROQ_API_KEY;

// top-level await 없이 async 함수로 감싸 실행 (require와 함께 쓰기 위함)
const main = async () => {
  // 어디로 보낼지 (주소) — Groq는 OpenAI 호환 형식
  const groqRes = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      // 데이터 보낼 땐 POST
      method: "POST",
      headers: {
        // "JSON으로 보낸다" 알림
        "Content-Type": "application/json",
        // 키로 "나 사용 권한 있어요" 증명
        Authorization: "Bearer " + key,
      },
      // 보낼 내용 (객체를 문자열로 변환)
      body: JSON.stringify({
        // 쓸 AI 모델 (무료·빠름)
        model: "llama-3.1-8b-instant",
        // 보낼 질문
        messages: [{ role: "user", content: "충치가 안생기는 방법" }],
      }),
    },
  );

  // 응답을 객체로 변환
  const data = await groqRes.json();
  // 이 안에 AI 답이 들어 있음
  console.log(data.choices?.[0]?.message?.content || data);
};

main();

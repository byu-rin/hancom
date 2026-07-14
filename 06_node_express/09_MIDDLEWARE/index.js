const express = require("express");
const cors = require("cors"); // npm install cors (최초 1회)
const app = express();

// 미들웨어 = 모든 요청이 라우트 전에 위→아래 순서대로 거침 (라우트 위에 둠)
app.use(cors()); // 다른 포트(프론트 5173 등) 허용
app.use(express.json()); // POST body → req.body 객체로 해석
app.use((req, res, next) => {
  // 직접 만든 미들웨어
  console.log("접속한 브라우저 정보:", req.headers["user-agent"]); // 모든 요청 로그 찍기
  next(); // 다음으로 넘김 (안 부르면 여기서 멈춤)
});

// 미들웨어 다 거친 뒤 라우트 실행
app.get("/api/users", (req, res) => res.json([{ id: 1, name: "지니" }]));

app.listen(3000, () => console.log("http://localhost:3000/api/users"));

/*
http://localhost:3000/api/users 접속 시
JSON 데이터가 뜨는 동시에, 서버가 켜져 있는 VSCode 터미널 창에는 아래와 같은 로그가 찍힌다.

GET /api/users

내부 동작흐름은 아래와 같다.
1. 브라우저가 주소로 요청을 보냄 -> 요청
2. core() 미들웨어가 다른 도메인 접근 허용을 먼저 체크함 -> app.use(cors)
3. express.json() 이, 들어오는 데이터를 해석할 준비를 함 -> app.use(json)
4. 함수가 실행되어 터미널에 GET/ /api/users 를 출력하고 next() 를 호출함 -> app.use(log)
5. 진짜 주소를 처리함 -> app.get/post
6. 브라우저 화면에 유저 데이터를 던져줌 -> 응답
*/

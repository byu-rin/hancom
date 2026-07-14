console.log("JS 실행됨");

const studentsDiv = document.querySelector("#students");
console.log(studentsDiv);

const className = "반이름";
const url = `http://192.168.10.28:5000/hancom/${className}/users`;
// const studentsDiv = document.querySelector("#students");

document.querySelector("#loadBtn").onclick = loadStudents;
document.querySelector("#addBtn").onclick = addStudent;

document.addEventListener("mousemove", (e) => {
  document.querySelectorAll(".student").forEach((card) => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const y = e.clientY - rect.top;

    card.style.setProperty("--x", `${x}px`);

    card.style.setProperty("--y", `${y}px`);
  });
});

// --------------------
// GET
// --------------------

async function loadStudents() {
  console.log("loadStudents");
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "HANCOM",
      },
    });

    if (!res.ok) throw new Error(res.status);

    const students = await res.json();

    renderStudents(students);
  } catch (err) {
    alert(err.message);
  }
}

// --------------------
// 화면 출력
// --------------------

function renderStudents(list) {
  studentsDiv.innerHTML = "";

  list.forEach((student) => {
    const div = document.createElement("div");

    div.className = "student";

    div.innerHTML = `

            <div class="id">#${student.id}</div>

            <div class="name">${student.name}</div>

        `;

    div.onclick = () => updateStudent(student);

    div.oncontextmenu = (e) => {
      e.preventDefault();

      if (confirm(`${student.name} 삭제하시겠습니까?`))
        deleteStudent(student.id);
    };

    studentsDiv.appendChild(div);
  });
}

// --------------------
// PUT
// --------------------

async function updateStudent(student) {
  const newName = prompt("새 이름", student.name);

  if (!newName) return;

  const putUrl = `${url}/${student.id}`;

  await fetch(putUrl, {
    method: "PUT",

    headers: {
      Authorization: "HANCOM",
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      id: student.id,

      name: newName,
    }),
  });

  loadStudents();
}

// --------------------
// POST
// --------------------

async function addStudent() {
  const name = prompt("학생 이름");

  if (!name) return;

  const res = await fetch(url, {
    method: "GET",

    headers: {
      Authorization: "HANCOM",
    },
  });

  const list = await res.json();

  const nextId = Math.max(...list.map((v) => v.id)) + 1;

  await fetch(url, {
    method: "POST",

    headers: {
      Authorization: "HANCOM",
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      id: nextId,

      name: name,
    }),
  });

  loadStudents();
}

// --------------------
// DELETE
// --------------------

async function deleteStudent(id) {
  const deleteUrl = `${url}/${id}`;

  await fetch(deleteUrl, {
    method: "DELETE",

    headers: {
      Authorization: "HANCOM",
    },
  });

  loadStudents();
}

// 첫 실행
loadStudents();

// GET - 수강생 데이터 전체 조회
// fetch(url, {
//   method: "GET",
//   headers: {
//     Authorization: "HANCOM",
//   },
// })
//   .then((res) => {
//     if (!res.ok) throw new Error(`상태코드 : ${res.status}`);
//     return res.json();
//   })
//   .then((data) => {
//     console.log("⭕ 데이터 가져오기 성공");
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log("❌ 데이터 가져오기 실패:", err.message);
//   });

// // POST - 수강생 추가
// console.log("새로운 학생 추가 요청 중");

// fetch(url, {
//   method: "POST", // ◀ 추가 메서드 지정
//   headers: {
//     Authorization: "HANCOM",
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     id: 20,
//     name: "한윤지",
//   }),
// })
//   .then((res) => {
//     if (!res.ok) throw new Error(`추가 실패 상태코드 : ${res.status}`);
//     return res.json();
//   })
//   .then((result) => {
//     console.log("⭕ 데이터 추가 성공!");
//     console.log("서버 확인 응답:", result);

//     // ⭐ [2단계] 추가가 완전히 완료된 후, 최신 전체 명단을 다시 요청합니다.
//     console.log("\n🔄 전체 명단 받아오는 중...");
//     return fetch(url, {
//       method: "GET",
//       headers: { Authorization: "HANCOM" },
//     });
//   })
//   .then((res) => {
//     if (!res) return;
//     return res.json();
//   })
//   .then((latestData) => {
//     if (!latestData) return;
//     console.log("📊 전체 데이터 명단 :");
//     console.log(latestData); // 학생 추가 완료
//   })
//   .catch((err) => {
//     console.log("❌ 작업 도중 에러 발생:", err.message);
//   });

// // DELETE - 특정 유저 데이터 삭제
// const deleteId = 2;
// const deleteUrl = `${url}/${deleteId}`;

// fetch(deleteUrl, {
//   method: "DELETE", // ◀ 삭제 메서드 지정 (body 데이터는 필요 없습니다)
//   headers: {
//     Authorization: "HANCOM", // 必: 인증 토큰
//   },
// })
//   .then((res) => {
//     if (!res.ok) throw new Error(`삭제 상태코드 : ${res.status}`);
//     return res.json(); // 서버가 삭제 후 보내주는 확인 데이터를 읽음
//   })
//   .then((result) => {
//     console.log(`⭕ 원격 서버에서 ${deleteId}번 유저 삭제 완료!`);
//     console.log("서버 응답 결과:", result);

//     // 삭제 완료 후 전체 명단 재요청
//     console.log("\n🔄 최신 전체 명단 받아오는 중...");
//     return fetch(url, {
//       method: "GET",
//       headers: { Authorization: "HANCOM" },
//     });
//   })
//   .then((res) => {
//     if (!res) return; // 만약 앞선 단계에서 에러가 났다면 중단
//     return res.json(); // 재조회한 데이터를 가공
//   })
//   .then((latestData) => {
//     if (!latestData) return;
//     console.log("📊 전체 데이터 명단 :");
//     console.log(latestData); // 💡 15번 유저가 사라진 목록을 눈으로 확인!
//   })
//   .catch((err) => {
//     console.log("❌ 삭제 실패:", err.message);
//   });

// // PUT - 특정 유저 데이터 수정
// const targetId = 16;
// const putUrl = `${url}/${targetId}`;

// fetch(putUrl, {
//   method: "PUT", // ◀ 수정 메서드 지정
//   headers: {
//     Authorization: "HANCOM", // 必: 인증 토큰
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({ id: 15, name: "양하은" }),
// })
//   .then((res) => {
//     if (!res.ok) throw new Error(`수정 상태코드 : ${res.status}`);
//     return res.json();
//   })
//   .then((updateUser) => {
//     console.log(`⭕ 원격 서버 데이터 수정 완료`);
//     console.log("바뀐 유저 정보:", updateUser);

//     // 수정 완료 후 전체 명단 재요청
//     console.log("\n🔄 전체 명단 재요청 ");
//     return fetch(url, {
//       method: "GET",
//       headers: { Authorization: "HANCOM" },
//     });
//   })
//   .then((res) => {
//     if (!res) return; // 만약 앞선 단계에서 에러가 났다면 중단
//     return res.json(); // 재조회한 데이터를 가공
//   })
//   .then((latestData) => {
//     if (!latestData) return;
//     console.log("📊 전체 데이터 명단 :");
//     console.log(latestData); // 💡 수정사항 확인
//   })
//   .catch((err) => {
//     console.log("❌ 수정 실패:", err.message);
//   });

/*
  서버 DELETE 기능에서, findIndex 와 splice 조합을 썼다면, 중복 아이디가 모두 삭제되지 않고 하나만 사라진다. 즉, 가장 먼저 찾은 '하나'만 지우고 끝남.
  */

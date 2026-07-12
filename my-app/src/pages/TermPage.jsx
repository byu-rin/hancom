import { useParams, Link } from "react-router-dom";
import { terms } from "../data/terms.js";
import "./TermPage.css";

const TermPage = () => {
  // 1. 주소창 URL 경로에서 id 변수 꺼내기
  const { id } = useParams();

  // 2. 데이터 배열(terms)에서 주소창 id 와 일치하는 데이터 찾기
  const term = terms.find((t) => t.id === id);

  // 3. (조건부 렌더링 - 예외처리): 찾는 데이터가 없을 때
  if (!term) {
    return (
      // "없는 용어입니다" 안내 + 홈으로 돌아가는 Link
      <div className="term-page-error">
        <h2>존재하지 않는 용어입니다.</h2>
        <p>입력하신 주소를 다시 확인해 주세요.</p>
        <Link to="/" className="back-link">
          🏠 홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    // 정상 화면
    <main className="term-page">
      <article className="term-detail">
        <span className="term-category">{term.category}</span>
        <h1 className="term-title">{term.name}</h1>
        <p className="term-description">{term.description}</p>

        {/* 예시 문장이나 추가 정보가 데이터에 있다면 출력 */}
        {term.example && (
          <div className="term-example">
            <strong>💡 예시:</strong> <code>{term.example}</code>
          </div>
        )}

        <br />
        <Link to="/" className="back-link">
          ← 목록으로 돌아가기
        </Link>
      </article>
    </main>
  );
};

export default TermPage;

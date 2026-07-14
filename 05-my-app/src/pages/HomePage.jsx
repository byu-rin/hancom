import { terms } from "../data/terms";
import TermCard from "../components/TermCard";
import "./HomePage.css";

function HomePage({ children }) {
  return (
    <main className="home">
      <h1>React 용어 사전</h1>

      {children}

      <div className="home-grid">
        {/* 배열을 map 으로 돌려 카드 여러 개, 각 항목 key 필수 */}
        {terms.map((term) => (
          <TermCard key={term.id} term={term} />
        ))}
      </div>
    </main>
  );
}

export default HomePage;

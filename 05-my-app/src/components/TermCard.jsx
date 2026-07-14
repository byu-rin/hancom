import { Link } from "react-router-dom";
import "./TermCard.css";

// props 로 용어 하나(term)를 받아 카드로 그림
function TermCard({ term }) {
  return (
    <Link to={`/term/${term.id}`} className="term-card">
      <h3 className="term-card-name">{term.name}</h3>
      <p className="term-card-short">{term.short}</p>
    </Link>
  );
}

export default TermCard;

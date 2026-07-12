import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* 로고를 누르면 메인 경로("/") 로 이동 */}
      <Link to="/" className="navbar-logo">
        📘 React 용어 사전
      </Link>
    </nav>
  );
};

export default Navbar;

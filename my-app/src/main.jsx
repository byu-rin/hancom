import { StrictMode } from "react";
import { createRoot } from "react-dom/client"; // 화면에 그려주는 도구
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx"; // 내가 만든 화면(App) 가져옴

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

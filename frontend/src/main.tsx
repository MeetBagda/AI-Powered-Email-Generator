import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { EmailProvider } from "./context/EmailContext"; // Import your EmailProvider

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EmailProvider>
      <App />
    </EmailProvider>
  </StrictMode>
);

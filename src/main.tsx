import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import setFavicon from "./utils/faviconSwitcher.ts";
// import "inter-ui/inter.css";

setFavicon();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <App />
  // </StrictMode>,
);

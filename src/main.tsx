import { createRoot } from "react-dom/client";
import { Helmet, HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import setFavicon from "./utils/faviconSwitcher.ts";
// import "inter-ui/inter.css";

setFavicon();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <HelmetProvider>
    <Helmet>
      <title>TB - React</title>
    </Helmet>
    <App />
  </HelmetProvider>
  // </StrictMode>,
);

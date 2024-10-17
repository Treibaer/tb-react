import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import setFavicon from "./utils/faviconSwitcher.ts";
// import "inter-ui/inter.css";
import * as Sentry from "@sentry/react";

setFavicon();


Sentry.init({
  dsn: "https://9488244f6ef3e6ea84101ad47fffba17@o4508134031818752.ingest.de.sentry.io/4508134034636880",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <App />
  // </StrictMode>,
);

import "@src/index.css";
import {PrivacyPolicy} from "@src/react/pages/legal/privacy/PrivacyPolicy";
import {StrictMode} from "react";
import {hydrateRoot} from "react-dom/client";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Could not find the '#root' element in privacy.html");

hydrateRoot(
  rootElement,
  <StrictMode>
    <PrivacyPolicy />
  </StrictMode>,
);

import "@src/index.css";
import {TermsOfService} from "@src/react/pages/legal/terms/TermsOfService";
import {StrictMode} from "react";
import {hydrateRoot} from "react-dom/client";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Could not find the '#root' element in terms.html");

hydrateRoot(
  rootElement,
  <StrictMode>
    <TermsOfService />
  </StrictMode>,
);

import "@src/index.css";
import "@src/react/pages/references/References.css";
import {ReferencesPage} from "@src/react/pages/references/ReferencesPage";
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Could not find the '#root' element in references.html");

// A separate entry: reading credits must not start a second game or write to its stored state.
createRoot(rootElement).render(
  <StrictMode>
    <ReferencesPage />
  </StrictMode>,
);

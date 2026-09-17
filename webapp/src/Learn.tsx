import "@src/index.css";
import {LearnPage} from "@src/react/pages/learn/LearnPage";
import {StrictMode} from "react";
import {hydrateRoot} from "react-dom/client";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Could not find the '#root' element in learn.html");

hydrateRoot(
  rootElement,
  <StrictMode>
    <LearnPage />
  </StrictMode>,
);

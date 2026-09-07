import "@src/index.css";
import {App} from "@src/react/App";
import {store} from "@src/redux/Store";
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Could not find the '#root' element in index.html");

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);

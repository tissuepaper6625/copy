import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { PrivyProvider } from "./lib/PrivyProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PrivyProvider>
      <App />
    </PrivyProvider>
  </React.StrictMode>
);

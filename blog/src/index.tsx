import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";
import "./index.css";
import { MainRoute } from "./routes";
import { light } from "./styles/themes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={light}>
      <MainRoute />
    </ThemeProvider>
  </React.StrictMode>
);

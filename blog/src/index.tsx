import React from "react";
import ReactDOM from "react-dom/client";
import styled from "styled-components";
import Theme from "./components/Theme";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { App } from "./routes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const Wrapper = styled.div`
  box-sizing: border-box;
`;

root.render(
  <React.StrictMode>
    <Theme>
      <Wrapper>
        <App />
      </Wrapper>
    </Theme>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

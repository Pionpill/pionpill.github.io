import React, { ReactNode } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";
import "./index.css";
import { MainRoute } from "./routes";
import store, { RootState } from "./store";
import { dark, light } from "./styles/themes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const Theme: React.FC<{ children: ReactNode }> = ({ children }) => {
  const theme =
    useSelector((state: RootState) => state.root.theme) === "light"
      ? light
      : dark;
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Theme>
        <MainRoute />
      </Theme>
    </Provider>
  </React.StrictMode>
);

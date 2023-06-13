import { CssBaseline, ThemeProvider } from "@mui/material";
import i18n from "i18next";
import React, { PropsWithChildren } from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { Provider, useSelector } from "react-redux";
import useThemeChoice from "./hooks/useThemeChoice";
import resources from "./i18n/resource";
import AppRoutes from "./routes";
import store, { RootState } from "./stores";
import { darkTheme, lightTheme } from "./styles/theme";

const MuiThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const theme = useThemeChoice(lightTheme, darkTheme);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const I18nProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const lang = useSelector((state: RootState) => state.app.lang);

  i18n.use(initReactI18next).init({
    resources,
    lng: lang,
    interpolation: {
      escapeValue: false,
    },
  });

  return (
    <I18nextProvider defaultNS="translation" i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CssBaseline />
    <Provider store={store}>
      <MuiThemeProvider>
        <I18nProvider>
          <AppRoutes />
        </I18nProvider>
      </MuiThemeProvider>
    </Provider>
  </React.StrictMode>
);

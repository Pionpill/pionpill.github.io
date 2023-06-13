import { createSlice } from "@reduxjs/toolkit";

export type AppTheme = "dark" | "light";
export type AppLang = "en" | "zh";

interface AppState {
  theme: AppTheme;
  lang: AppLang;
}

const initTheme = (): AppTheme => {
  const localTheme = localStorage.getItem("theme");
  if (localTheme && (localTheme === "dark" || localTheme === "light"))
    return localTheme;
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
};

const initLang = (): AppLang => {
  const localLang = localStorage.getItem("lang");
  if (localLang && (localLang === "zh" || localLang === "en")) return localLang;
  if (navigator.language === "en") return "en";
  return "zh";
};

export const appSlice = createSlice({
  name: "app",
  initialState: {
    theme: initTheme(),
    lang: initLang(),
  },
  reducers: {
    switchTheme: (state: AppState) => {
      const theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", theme);
      state.theme = theme;
    },
    switchLang: (state: AppState) => {
      const lang = state.lang === "en" ? "zh" : "en";
      localStorage.setItem("lang", lang);
      state.lang = lang;
      console.log(state.lang);
    },
  },
});

export const { switchTheme, switchLang } = appSlice.actions;
export default appSlice.reducer;

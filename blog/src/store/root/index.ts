import { createSlice } from '@reduxjs/toolkit';

export interface ViewState {
  theme: String
}

const selectThemeByTime = (): string => {
  const hour: number = new Date().getHours();
  return (hour < 18 && hour > 6) ? "light" : "dark";
}

export const viewSlice = createSlice({
  name: 'view',
  initialState: {
    theme: selectThemeByTime()
  },
  reducers: {
    toggleTheme: (state: ViewState) => {
      console.log(`切换主题: ${state.theme}`);
      state.theme = state.theme === "dark" ? "light" : "dark";
    }
  }
})

export const { toggleTheme } = viewSlice.actions;
export default viewSlice.reducer;
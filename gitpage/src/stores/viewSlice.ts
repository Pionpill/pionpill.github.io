import { createSlice } from "@reduxjs/toolkit";

interface ViewState {
  isWeixinOpen: boolean;
  isEmailOpen: boolean;
  isPayOpen: boolean;
}

export const viewSlice = createSlice({
  name: "view",
  initialState: {
    isWeixinOpen: false,
    isEmailOpen: false,
    isPayOpen: false,
  },
  reducers: {
    toggleWeixin: (state: ViewState) => {
      state.isWeixinOpen = !state.isWeixinOpen;
    },
    toggleEmail: (state: ViewState) => {
      state.isEmailOpen = !state.isEmailOpen;
    },
    togglePay: (state: ViewState) => {
      state.isPayOpen = !state.isPayOpen;
    },
  },
});

export const { toggleWeixin, toggleEmail, togglePay } = viewSlice.actions;
export default viewSlice.reducer;

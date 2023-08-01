import { createSlice } from "@reduxjs/toolkit";

interface BlogState {
  category: string;
  asideOpen: boolean;
  tocOpen: boolean;
}

export const blogSlice = createSlice({
  name: "blog",
  initialState: {
    category: "front",
    asideOpen: false,
    tocOpen: false,
  },
  reducers: {
    changeBlogCategory: (
      state: BlogState,
      action: { type: string; payload: string }
    ) => {
      state.category = action.payload;
    },
    toggleAsideOpen: (state: BlogState) => {
      state.asideOpen = !state.asideOpen;
    },
    toggleTocOpen: (state: BlogState) => {
      state.tocOpen = !state.tocOpen;
    }
  },
});

export const { changeBlogCategory, toggleAsideOpen, toggleTocOpen } = blogSlice.actions;
export default blogSlice.reducer;

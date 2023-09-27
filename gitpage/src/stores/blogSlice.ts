import { createSlice } from "@reduxjs/toolkit";
import { BlogCategory } from "../models/blog";

interface BlogState {
  category: BlogCategory;
  asideOpen: boolean;
  tocOpen: boolean;
}

export const blogSlice = createSlice({
  name: "blog",
  initialState: {
    category: "front" as BlogCategory,
    asideOpen: false,
    tocOpen: false,
  },
  reducers: {
    changeBlogCategory: (
      state: BlogState,
      action: { type: string; payload: BlogCategory }
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

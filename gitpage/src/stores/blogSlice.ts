import { createSlice } from "@reduxjs/toolkit";

interface BlogState {
  category: string;
}

export const blogSlice = createSlice({
  name: "blog",
  initialState: {
    category: "front",
  },
  reducers: {
    changeBlogCategory: (
      state: BlogState,
      action: { type: string; payload: string }
    ) => {
      state.category = action.payload;
    },
  },
});

export const { changeBlogCategory } = blogSlice.actions;
export default blogSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import blogReducer from "./blogSlice";
import viewReducer from "./viewSlice";

const store = configureStore({
  reducer: {
    app: appReducer,
    view: viewReducer,
    blog: blogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;

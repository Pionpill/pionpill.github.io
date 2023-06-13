import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import viewReducer from "./viewSlice";

const store = configureStore({
  reducer: {
    app: appReducer,
    view: viewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;

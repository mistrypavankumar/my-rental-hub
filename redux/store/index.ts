import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import houseReducer from "../slices/houseSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    house: houseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

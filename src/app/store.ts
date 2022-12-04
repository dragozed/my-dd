import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import mapSlice from "../components/map/mapSlice";

export const store = configureStore({
  reducer: {
    map: mapSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

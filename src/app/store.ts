import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import dungeonSlice from "../components/dungeon/dungeonSlice";

export const store = configureStore({
  reducer: {
    dungeon: dungeonSlice,
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

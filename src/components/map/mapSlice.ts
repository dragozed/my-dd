import {
  bindActionCreators,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";

export interface MapState {
  depth: number;
  teamStats: [
    {
      name: string;
      health: number;
      speed: number;
      skillname: string;
      position: string;
      status: string;
    },
    {
      name: string;
      health: number;
      speed: number;
      skillname: string;
      position: string;
      status: string;
    },
    {
      name: string;
      health: number;
      speed: number;
      skillname: string;
      position: string;
      status: string;
    }
  ];
  enemyStats: [
    {
      name: string;
      health: number;
      speed: number;
      skillname: string;
      position: string;
      status: string;
    },
    {
      name: string;
      health: number;
      speed: number;
      skillname: string;
      position: string;
      status: string;
    },
    {
      name: string;
      health: number;
      speed: number;
      skillname: string;
      position: string;
      status: string;
    }
  ];
  status: "idle" | "loading" | "failed";
}

const initialState: MapState = {
  depth: 50,
  teamStats: [
    {
      name: "",
      health: 999,
      speed: 0,
      skillname: "",
      position: "T1",
      status: "",
    },
    {
      name: "",
      health: 999,
      speed: 0,
      skillname: "",
      position: "T2",
      status: "",
    },
    {
      name: "",
      health: 999,
      speed: 0,
      skillname: "",
      position: "T3",
      status: "",
    },
  ],
  enemyStats: [
    {
      name: "",
      health: 999,
      speed: 0,
      position: "E1",
      skillname: "",
      status: "",
    },
    {
      name: "",
      health: 999,
      speed: 0,
      position: "E2",
      skillname: "",
      status: "",
    },
    {
      name: "",
      health: 999,
      speed: 0,
      position: "E3",
      skillname: "",
      status: "",
    },
  ],
  status: "idle",
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    //Depth Reducers
    incrementDepth: (state) => {
      state.depth += 1;
    },
    decrementDepth: (state) => {
      state.depth -= 1;
    },
    incrementDepthBy: (state, action: PayloadAction<number>) => {
      state.depth += action.payload;
    },

    //Team Reducers
    setTeam: (
      state,
      action: PayloadAction<{
        row: number;
        value: {
          name: string;
          health: number;
          speed: number;
          skillname: string;
          position: string;
          status: string;
        };
      }>
    ) => {
      action.payload.row -= 1;
      state.teamStats[action.payload.row] = action.payload.value;
    },

    incrementHealthBy: (
      state,
      action: PayloadAction<{ row: number; value: number }>
    ) => {
      action.payload.row -= 1;
      state.teamStats[action.payload.row].health += action.payload.value;
    },
    decrementHealthBy: (
      state,
      action: PayloadAction<{ row: number; value: number }>
    ) => {
      action.payload.row -= 1;
      state.teamStats[action.payload.row].health -= action.payload.value;
    },
    changeStatus: (
      state,
      action: PayloadAction<{ row: number; value: string }>
    ) => {
      action.payload.row -= 1;
      state.teamStats[action.payload.row].status = action.payload.value;
    },
    //Enemy Reducers
    setEnemy: (
      state,
      action: PayloadAction<{
        row: number;
        value: {
          name: string;
          health: number;
          speed: number;
          skillname: string;
          position: string;
          status: string;
        };
      }>
    ) => {
      action.payload.row -= 1;
      state.enemyStats[action.payload.row] = action.payload.value;
    },
    incrementEHealthBy: (
      state,
      action: PayloadAction<{ row: number; value: number }>
    ) => {
      action.payload.row -= 1;
      state.enemyStats[action.payload.row].health += action.payload.value;
    },
    decrementEHealthBy: (
      state,
      action: PayloadAction<{ row: number; value: number }>
    ) => {
      action.payload.row -= 1;
      state.enemyStats[action.payload.row].health -= action.payload.value;
    },
    changeEStatus: (
      state,
      action: PayloadAction<{ row: number; value: string }>
    ) => {
      action.payload.row -= 1;
      state.enemyStats[action.payload.row].status = action.payload.value;
    },
  },
});

export const {
  incrementDepth,
  decrementDepth,
  incrementDepthBy,
  setTeam,
  setEnemy,
  incrementHealthBy,
  decrementHealthBy,
  incrementEHealthBy,
  decrementEHealthBy,
  changeEStatus,
  changeStatus,
} = mapSlice.actions;

export const selectDepth = (state: RootState) => state.map.depth;

export const selectTeam = (state: RootState) => state.map.teamStats;

export const selectEnemy = (state: RootState) => state.map.enemyStats;

export default mapSlice.reducer;

import {
  bindActionCreators,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Action } from "@remix-run/router";
import { RootState, AppThunk } from "../../app/store";

export interface DungeonState {
  depth: number;
  teamSelection: [
    { name: string; armour: string },
    { name: string; armour: string },
    { name: string; armour: string }
  ];
  teamStats: [
    {
      name: string;
      health: number;
      speed: number;
      physicalpow: number;
      arcanepow: number;
      skillname: string;
      position: string;
      status: string;
    },
    {
      name: string;
      health: number;
      speed: number;
      physicalpow: number;
      arcanepow: number;
      skillname: string;
      position: string;
      status: string;
    },
    {
      name: string;
      health: number;
      speed: number;
      physicalpow: number;
      arcanepow: number;
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
      physicalpow: number;
      arcanepow: number;
      skillname: string;
      position: string;
      status: string;
    },
    {
      name: string;
      health: number;
      speed: number;
      physicalpow: number;
      arcanepow: number;
      skillname: string;
      position: string;
      status: string;
    },
    {
      name: string;
      health: number;
      speed: number;
      physicalpow: number;
      arcanepow: number;
      skillname: string;
      position: string;
      status: string;
    }
  ];
  status: "idle" | "loading" | "failed";
}

const initialState: DungeonState = {
  depth: 0,
  teamSelection: [
    { name: "Harold", armour: "None" },
    { name: "Terra", armour: "None" },
    { name: "Lilith", armour: "None" },
  ],
  teamStats: [
    {
      name: "",
      health: 999,
      speed: 0,
      physicalpow: 0,
      arcanepow: 0,
      skillname: "",
      position: "T1",
      status: "",
    },
    {
      name: "",
      health: 999,
      speed: 0,
      physicalpow: 0,
      arcanepow: 0,
      skillname: "",
      position: "T2",
      status: "",
    },
    {
      name: "",
      health: 999,
      speed: 0,
      physicalpow: 0,
      arcanepow: 0,
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
      physicalpow: 0,
      arcanepow: 0,
      position: "E1",
      skillname: "",
      status: "",
    },
    {
      name: "",
      health: 999,
      speed: 0,
      physicalpow: 0,
      arcanepow: 0,
      position: "E2",
      skillname: "",
      status: "",
    },
    {
      name: "",
      health: 999,
      speed: 0,
      physicalpow: 0,
      arcanepow: 0,
      position: "E3",
      skillname: "",
      status: "",
    },
  ],
  status: "idle",
};

export const dungeonSlice = createSlice({
  name: "dungeon",
  initialState,
  reducers: {
    //Depth Reducers
    setDepth: (state, action: PayloadAction<number>) => {
      state.depth = action.payload;
    },
    incrementDepthBy: (state, action: PayloadAction<number>) => {
      state.depth += action.payload;
    },
    //TEAM SELECTION
    setTeamSelection: (
      state,
      action: PayloadAction<{
        value: [
          {
            name: string;
            armour: string;
          },
          {
            name: string;
            armour: string;
          },
          {
            name: string;
            armour: string;
          }
        ];
      }>
    ) => {
      state.teamSelection = action.payload.value;
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
          physicalpow: number;
          arcanepow: number;
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
          physicalpow: number;
          arcanepow: number;
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
  incrementDepthBy,
  setDepth,
  setTeamSelection,
  setTeam,
  setEnemy,
  incrementHealthBy,
  decrementHealthBy,
  incrementEHealthBy,
  decrementEHealthBy,
  changeEStatus,
  changeStatus,
} = dungeonSlice.actions;

export const selectDepth = (state: RootState) => state.dungeon.depth;

export const selectTeamSelection = (state: RootState) =>
  state.dungeon.teamSelection;

export const selectTeam = (state: RootState) => state.dungeon.teamStats;

export const selectEnemy = (state: RootState) => state.dungeon.enemyStats;

export default dungeonSlice.reducer;

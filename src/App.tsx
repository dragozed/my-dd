import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import { Dungeon } from "./components/dungeon/Dungeon";
import { Loadout } from "./components/loadout/Loadout";
import { teamGenerator } from "./components/logic";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { Home } from "./components/home/Home";
import {
  selectTeamSelection,
  setDepth,
} from "./components/dungeon/dungeonSlice";

function App() {
  const dispatch = useAppDispatch();

  const teamSelection = useAppSelector(selectTeamSelection);

  useEffect(() => {
    teamGenerator(
      dispatch,
      teamSelection[0],
      teamSelection[1],
      teamSelection[2]
    );
    dispatch(setDepth(0));
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/dungeon" element={<Dungeon />} />
          <Route path="/loadout" element={<Loadout />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import { Dungeon } from "./components/dungeon/Dungeon";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/dungeon" element={<Dungeon />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

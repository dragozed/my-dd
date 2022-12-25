import React, { useEffect, useState } from "react";

import { teamGenerator } from "../logic";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  addArmour,
  selectInventory,
  selectTeam,
  selectTeamSelection,
  setDepth,
  setInventory,
  setTeamSelection,
} from "../dungeon/dungeonSlice";
import "./Loadout.scss";
import { type } from "os";

export const Loadout = () => {
  const dispatch = useAppDispatch();

  const inventory = useAppSelector(selectInventory);
  const teamSelection = useAppSelector(selectTeamSelection);
  const [formInputs, setFormInputs] = useState({
    armour0: "None",
    armour1: "None",
    armour2: "None",
  });
  //team
  const teamStats = useAppSelector(selectTeam);

  const handleChange = (event: any) => {
    const row = event.target.value.split(",")[1];
    const value = event.target.value.split(",")[0];
    setFormInputs((prevState) => {
      return {
        ...prevState,
        [row]: value,
      };
    });
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    dispatch(
      setTeamSelection({
        value: [
          { name: "Harold", armour: formInputs.armour0 },
          { name: "Terra", armour: formInputs.armour1 },
          { name: "Lilith", armour: formInputs.armour2 },
        ],
      })
    );
  };
  useEffect(() => {
    teamGenerator(
      dispatch,
      teamSelection[0],
      teamSelection[1],
      teamSelection[2]
    );
  }, [teamSelection]);

  useEffect(() => {
    teamGenerator(
      dispatch,
      teamSelection[0],
      teamSelection[1],
      teamSelection[2]
    );
    dispatch(setDepth(0));
    dispatch(
      setInventory({
        armour: [
          { name: "None", type: "All" },
          { name: "DeadMansArmour", type: "All" },
        ],
      })
    );
  }, []);
  return (
    <>
      <div className="team">
        <div className="frontline">
          <div
            style={{
              backgroundImage: `url(/img/characters/${teamStats[0].name}.png)`,
            }}
            className="portrait"
          />{" "}
          <div className="name">{teamStats[0].name}</div>
          <div className="health">Health: {teamStats[0].health}</div>
          <div className="speed">Speed: {teamStats[0].speed}</div>
          <div className="phypow">PhyPow: {teamStats[0].physicalpow}</div>
          <div className="arcpow">ArcPow: {teamStats[0].arcanepow}</div>
        </div>
        <div className="midline">
          <div
            style={{
              backgroundImage: `url(/img/characters/${teamStats[1].name}.png)`,
            }}
            className="portrait"
          />{" "}
          <div className="name">{teamStats[1].name}</div>
          <div className="health">Health: {teamStats[1].health}</div>
          <div className="speed">Speed: {teamStats[1].speed}</div>
          <div className="phypow">PhyPow: {teamStats[1].physicalpow}</div>
          <div className="arcpow">ArcPow: {teamStats[1].arcanepow}</div>
        </div>
        <div className="backline">
          <div
            style={{
              backgroundImage: `url(/img/characters/${teamStats[2].name}.png)`,
            }}
            className="portrait"
          />{" "}
          <div className="name">{teamStats[2].name}</div>
          <div className="health">Health: {teamStats[2].health}</div>
          <div className="speed">Speed: {teamStats[2].speed}</div>
          <div className="phypow">PhyPow: {teamStats[2].physicalpow}</div>
          <div className="arcpow">ArcPow: {teamStats[2].arcanepow}</div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-inputs">
          <div className="frontline-inputs">
            <label htmlFor="armour">Select Armour: </label>
            <select id="armour" onChange={handleChange}>
              {inventory.armour.map((e, key) => {
                return e.type === "All" || e.type === "Heavy" ? (
                  <option key={key} value={`${e.name},armour0`}>
                    {e.name}
                  </option>
                ) : (
                  ""
                );
              })}
            </select>
          </div>
          <div className="midline-inputs">
            <label htmlFor="armour">Select Armour: </label>
            <select id="armour" onChange={handleChange}>
              {inventory.armour.map((e, key) => {
                return e.type === "All" || e.type === "Medium" ? (
                  <option key={key} value={`${e.name},armour1`}>
                    {e.name}
                  </option>
                ) : (
                  ""
                );
              })}
            </select>
          </div>
          <div className="backline-inputs">
            <label htmlFor="armour">Select Armour: </label>
            <select id="armour" onChange={handleChange}>
              {inventory.armour.map((e, key) => {
                return e.type === "All" || e.type === "Light" ? (
                  <option key={key} value={`${e.name},armour2`}>
                    {e.name}
                  </option>
                ) : (
                  ""
                );
              })}
            </select>
          </div>
        </div>

        <input type="submit" value="Submit" />
      </form>
      <div className="inventory">
        <div className="currencies">Gold:{inventory.currency[0].gold}</div>
      </div>
    </>
  );
};

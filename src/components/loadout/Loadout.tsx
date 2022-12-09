import React, { useEffect, useState } from "react";

import { teamGenerator } from "../logic";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  selectTeam,
  selectTeamSelection,
  setDepth,
  setTeamSelection,
} from "../dungeon/dungeonSlice";
import "./Loadout.scss";

export const Loadout = () => {
  const dispatch = useAppDispatch();

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
    console.log(formInputs);

    //setFormInputs(event.target.value);
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
  }, []);
  return (
    <>
      {formInputs.armour0}
      {formInputs.armour1}
      {formInputs.armour2}
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
              <option value={"None,armour0"}>None</option>
              <option value={"DeadMansArmour,armour0"}>DeadMansArmour</option>
            </select>
          </div>
          <div className="midline-inputs">
            <label htmlFor="armour">Select Armour: </label>
            <select id="armour" onChange={handleChange}>
              <option value={"None,armour1"}>None</option>
              <option value={"DeadMansArmour,armour1"}>DeadMansArmour</option>
            </select>
          </div>
          <div className="backline-inputs">
            <label htmlFor="armour">Select Armour: </label>
            <select id="armour" onChange={handleChange}>
              <option value={"None,armour2"}>None</option>
              <option value={"DeadMansArmour,armour2"}>DeadMansArmour</option>
            </select>
          </div>
        </div>

        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

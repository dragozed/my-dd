import React, { useEffect, useState } from "react";

import {
  attackEnemy,
  generateFloor,
  attackOrdCalc,
  targetableEnemy,
  simEnemyAttack,
} from "./logic";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  incrementDepth,
  selectDepth,
  selectTeam,
  selectEnemy,
  changeEStatus,
  changeStatus,
} from "./mapSlice";
import "./map.scss";

export function Map() {
  const dispatch = useAppDispatch();

  const depth = useAppSelector(selectDepth);
  //team
  const teamStats = useAppSelector(selectTeam);
  //enemy
  const enemyStats = useAppSelector(selectEnemy);

  const [attackOrder, setAttackOrder] = useState([
    {
      name: "",
      health: 999,
      speed: 0,
      position: "T1",
      skillname: "",
      status: "",
    },
  ]);
  const [fightBgn, setFightBgn] = useState(false);
  const [enemyDisable, setEnemyDisable] = useState([true, true, true]);

  const currAttacker = {
    team: attackOrder[0].position.charAt(0),
    row: Number(attackOrder[0].position.charAt(1)) - 1,
    status: attackOrder[0].status,
  };

  useEffect(() => {
    generateFloor(dispatch, depth);
  }, []);

  useEffect(() => {
    controlStatus();
  }, [enemyStats, teamStats]);

  //Internal Functions
  const controlStatus = () => {
    enemyStats.map((item, key) => {
      if (item.health <= 0 && item.status !== "Dead") {
        dispatch(changeEStatus({ row: key + 1, value: "Dead" }));
        setAttackOrder(attackOrder.filter((e) => e.position !== item.position));
      }
    });
    teamStats.map((item, key) => {
      if (item.health <= 0 && item.status !== "Dead") {
        dispatch(changeStatus({ row: key + 1, value: "Dead" }));
        setAttackOrder(attackOrder.filter((e) => e.position !== item.position));
      }
    });
  };

  return (
    <div className="room-container">
      <div className="topbar">
        <div className="action-order">
          {attackOrder.map((item, key) => {
            return <div key={key}>{item.name}</div>;
          })}
          <button
            disabled={!(currAttacker.team === "E" && fightBgn)}
            onClick={() => {
              setAttackOrder(
                simEnemyAttack(
                  dispatch,
                  enemyStats[currAttacker.row].skillname,
                  attackOrder,
                  teamStats
                )
              );
            }}
          >
            PlayEnemyTurn
          </button>
        </div>
        <div className="depth">Depth: {depth}</div>
        <div className="utility-buttons">
          <button
            disabled={fightBgn}
            onClick={() => {
              //Begin Fight
              setAttackOrder(attackOrdCalc(teamStats, enemyStats));
              setFightBgn(true);
            }}
          >
            Begin Fight
          </button>
        </div>
      </div>
      <div className="field">
        <div className="team">
          <div className="characters">
            <div
              onClick={() => {}}
              className={`frontline ${
                currAttacker.team + currAttacker.row === "T0" ? "active" : ""
              }`}
            >
              {teamStats[0].name}
            </div>
            <div
              onClick={() => {}}
              className={`midline ${
                currAttacker.team + currAttacker.row === "T1" ? "active" : ""
              }`}
            >
              {teamStats[1].name}
            </div>
            <div
              onClick={() => {}}
              className={`backline ${
                currAttacker.team + currAttacker.row === "T2" ? "active" : ""
              }`}
            >
              {teamStats[2].name}
            </div>
          </div>
          <div className="info-bar">
            <div className="skill-bar">
              <button
                disabled={!(currAttacker.team === "T" && fightBgn)}
                className="skill"
                onClick={() => {
                  setEnemyDisable(
                    targetableEnemy(teamStats[currAttacker.row].skillname)
                  );
                }}
              >
                {teamStats[currAttacker.row].skillname}
              </button>
            </div>
            <div className="character-info">
              <div className="ft-info">
                <div className="name">{teamStats[0].name}</div>
                <div className="health">Health: {teamStats[0].health}</div>
                <div className="speed">Speed: {teamStats[0].speed}</div>
                <div className="status">Status: {teamStats[0].status}</div>
              </div>
              <div className="mt-info">
                <div className="name">{teamStats[1].name}</div>
                <div className="health">Health: {teamStats[1].health}</div>
                <div className="speed">Speed: {teamStats[1].speed}</div>
                <div className="status">Status: {teamStats[1].status}</div>
              </div>
              <div className="bt-info">
                <div className="name">{teamStats[2].name}</div>
                <div className="health">Health: {teamStats[2].health}</div>
                <div className="speed">Speed: {teamStats[2].speed}</div>
                <div className="status">Status: {teamStats[2].status}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="encounter">
          <div className="enemies">
            <div
              className={`frontline ${
                currAttacker.team + currAttacker.row === "E0" ? "active" : ""
              }`}
            >
              {enemyStats[0].name}
            </div>
            <button
              disabled={enemyDisable[0] || enemyStats[0].status === "Dead"}
              onClick={() => {
                setAttackOrder(
                  attackEnemy(
                    dispatch,
                    teamStats[currAttacker.row].skillname,
                    1,
                    attackOrder
                  )
                );
                setEnemyDisable([true, true, true]);
              }}
            >
              ATTACK!
            </button>
            <div
              className={`midline ${
                currAttacker.team + currAttacker.row === "E1" ? "active" : ""
              }`}
            >
              {enemyStats[1].name}
            </div>
            <button
              disabled={enemyDisable[1] || enemyStats[1].status === "Dead"}
              onClick={() => {
                setAttackOrder(
                  attackEnemy(
                    dispatch,
                    teamStats[currAttacker.row].skillname,
                    2,
                    attackOrder
                  )
                );
                setEnemyDisable([true, true, true]);
              }}
            >
              ATTACK!
            </button>
            <div
              className={`backline ${
                currAttacker.team + currAttacker.row === "E2" ? "active" : ""
              }`}
            >
              {enemyStats[2].name}
            </div>
            <button
              disabled={enemyDisable[2] || enemyStats[2].status === "Dead"}
              onClick={() => {
                setAttackOrder(
                  attackEnemy(
                    dispatch,
                    teamStats[currAttacker.row].skillname,
                    3,
                    attackOrder
                  )
                );
                setEnemyDisable([true, true, true]);
              }}
            >
              ATTACK!
            </button>
          </div>
          <div className="enemy-info">
            <div className="fe-info">
              <div className="name">{enemyStats[0].name}</div>
              <div className="health">Health: {enemyStats[0].health}</div>
              <div className="speed">Speed: {enemyStats[0].speed}</div>
              <div className="status">Status: {enemyStats[0].status}</div>
            </div>
            <div className="me-info">
              <div className="name">{enemyStats[1].name}</div>
              <div className="health">Health: {enemyStats[1].health}</div>
              <div className="speed">Speed: {enemyStats[1].speed}</div>
              <div className="status">Status: {enemyStats[1].status}</div>
            </div>
            <div className="be-info">
              <div className="name">{enemyStats[2].name}</div>
              <div className="health">Health: {enemyStats[2].health}</div>
              <div className="speed">Speed: {enemyStats[2].speed}</div>
              <div className="status">Status: {enemyStats[2].status}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottombar">
        <button
          onClick={() => {
            dispatch(incrementDepth());
          }}
        >
          Go Deeper
        </button>
      </div>
    </div>
  );
}

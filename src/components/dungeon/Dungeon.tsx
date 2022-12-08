import React, { useEffect, useState } from "react";
import Modal from "react-modal";

import {
  attackEnemy,
  generateFloor,
  attackOrdCalc,
  targetableEnemy,
  simEnemyAttack,
  encounterGenerator,
} from "./logic";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  selectDepth,
  selectTeam,
  selectEnemy,
  changeEStatus,
  changeStatus,
  setDepth,
} from "./dungeonSlice";
import "./Dungeon.scss";

Modal.setAppElement("#root");

export const Dungeon = () => {
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
  const [enemyDisable, setEnemyDisable] = useState([true, true, true]);
  //operational
  const [fightBgn, setFightBgn] = useState(false);
  const [floorOver, setFloorOver] = useState(false);
  const [victory, setVictory] = useState(false);

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
    if (
      enemyStats[0].status === "Dead" &&
      enemyStats[1].status === "Dead" &&
      enemyStats[2].status === "Dead"
    ) {
      setVictory(true);
      setFloorOver(true);
    } else if (
      teamStats[0].status === "Dead" &&
      teamStats[1].status === "Dead" &&
      teamStats[2].status === "Dead"
    ) {
      setVictory(false);
      setFloorOver(true);
    }
  };

  const goDepth = (floor: number, resTeam: boolean) => {
    setVictory(false);
    setFightBgn(false);
    setFloorOver(false);
    resTeam
      ? generateFloor(dispatch, floor)
      : encounterGenerator(dispatch, floor);
  };

  return (
    <div className="room-container">
      <Modal
        isOpen={floorOver}
        style={{
          overlay: { backgroundColor: "grey" },
        }}
      >
        {victory ? (
          <>
            <div className="info-text">You Succeed</div>
            <button
              onClick={() => {
                goDepth(depth + 1, false);
              }}
            >
              Go Deeper
            </button>
          </>
        ) : (
          <>
            <div className="info-text">Your Team Failed</div>
            <button
              onClick={() => {
                goDepth(0, true);
              }}
            >
              Return Depth 0
            </button>
          </>
        )}
      </Modal>
      <div className="topbar">
        <div className="action-order">
          {attackOrder.map((item, key) => {
            return <div key={key}>{item.name}</div>;
          })}
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
                    teamStats[currAttacker.row].physicalpow,
                    teamStats[currAttacker.row].arcanepow,
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
                    teamStats[currAttacker.row].physicalpow,
                    teamStats[currAttacker.row].arcanepow,
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
                    teamStats[currAttacker.row].physicalpow,
                    teamStats[currAttacker.row].arcanepow,
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
          <div className="enemy-info-bar">
            <div className="enemy-skill-bar">
              <button
                disabled={!(currAttacker.team === "E" && fightBgn)}
                onClick={() => {
                  setAttackOrder(
                    simEnemyAttack(
                      dispatch,
                      enemyStats[currAttacker.row].skillname,
                      enemyStats[currAttacker.row].physicalpow,
                      enemyStats[currAttacker.row].arcanepow,
                      attackOrder,
                      teamStats
                    )
                  );
                }}
              >
                PlayEnemyTurn
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
      </div>
      <div className="bottombar">
        <button onClick={() => {}}>Decoy Button</button>
      </div>
    </div>
  );
};
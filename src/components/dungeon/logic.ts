import React, { useState } from "react";
import { Action } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  incrementDepthBy,
  selectDepth,
  selectTeam,
  selectEnemy,
  setTeam,
  incrementHealthBy,
  decrementHealthBy,
  decrementEHealthBy,
  setEnemy,
  setDepth,
  changeEStatus,
} from "./dungeonSlice";
import { useDispatch } from "react-redux";

const getRndInteger = (min: number, max: number) => {
  //min-max included
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const targetableEnemy = (skillname: string) => {
  //INVERTED TRUE-FALSE
  if (
    skillname === "FSkill" ||
    skillname === "MSkill" ||
    skillname === "BSkill"
  ) {
    return [false, false, false];
  } else {
    return [true, true, true];
  }
};

export const attackEnemy = (
  dispatch: any,
  skillname: string,
  physicalpow: number,
  arcanepow: number,
  enemyrow: number,
  attackorder: Array<any>
) => {
  damageEnemy(dispatch, skillname, physicalpow, arcanepow, enemyrow);
  attackorder = arrangeAttOrder(attackorder);
  return attackorder;
};

const damageEnemy = (
  dispatch: any,
  skillname: string,
  physicalpow: number,
  arcanepow: number,
  enemyrow: number
) => {
  const skilldamage = getSkillDmg(skillname, physicalpow, arcanepow);
  dispatch(decrementEHealthBy({ row: enemyrow, value: skilldamage }));
};

interface DamageLibrary {
  [name: string]: number;
}
const getSkillDmg = (
  skillname: string,
  physicalpow: number,
  arcanepow: number
) => {
  const skillDamageLib: DamageLibrary = {
    FSkill: 1 * physicalpow,
    MSkill: 1 * physicalpow,
    BSkill: 1 * arcanepow,
    EFSkill: 1 * physicalpow,
    EMSkill: 1 * physicalpow,
    EBSkill: 1 * arcanepow,
  };
  return skillDamageLib[skillname];
};

const arrangeAttOrder = (attackorder: Array<any>) => {
  attackorder.push(attackorder[0]);
  attackorder.shift();
  return attackorder;
};

export const generateFloor = (dispatch: any, depth: number) => {
  teamGenerator(dispatch);
  encounterGenerator(dispatch, depth);
};

const teamGenerator = (dispatch: any) => {
  dispatch(
    setTeam({
      row: 1,
      value: {
        name: "Harold",
        health: 50,
        speed: 3,
        physicalpow: 10,
        arcanepow: 0,
        skillname: "FSkill",
        position: "T1",
        status: "Alive",
      },
    })
  );
  dispatch(
    setTeam({
      row: 2,
      value: {
        name: "Terra",
        health: 15,
        speed: 12,
        physicalpow: 15,
        arcanepow: 0,
        skillname: "MSkill",
        position: "T2",
        status: "Alive",
      },
    })
  );
  dispatch(
    setTeam({
      row: 3,
      value: {
        name: "Lilith",
        health: 5,
        speed: 15,
        physicalpow: 0,
        arcanepow: 10,
        skillname: "BSkill",
        position: "T3",
        status: "Alive",
      },
    })
  );
};

export const encounterGenerator = (dispatch: any, depth: number) => {
  dispatch(setDepth(depth));
  const k = Math.ceil((depth + 1) / 10); //increased by 1 every 10 levels
  dispatch(
    setEnemy({
      row: 1,
      value: {
        name: "EFrnt",
        health: getRndInteger(20 * k, 30 * k),
        speed: getRndInteger(3 * k, 7 * k),
        physicalpow: getRndInteger(10 * k, 15 * k),
        arcanepow: getRndInteger(0 * k, 0 * k),
        skillname: "EFSkill",
        position: "E1",
        status: "Alive",
      },
    })
  );
  dispatch(
    setEnemy({
      row: 2,
      value: {
        name: "EMid",
        health: getRndInteger(6 * k, 20 * k),
        speed: getRndInteger(7 * k, 13 * k),
        physicalpow: getRndInteger(12 * k, 17 * k),
        arcanepow: getRndInteger(0 * k, 0 * k),
        skillname: "EMSkill",
        position: "E2",
        status: "Alive",
      },
    })
  );
  dispatch(
    setEnemy({
      row: 3,
      value: {
        name: "EBack",
        health: getRndInteger(2 * k, 10 * k),
        speed: getRndInteger(10 * k, 20 * k),
        physicalpow: getRndInteger(0 * k, 0 * k),
        arcanepow: getRndInteger(10 * k, 20 * k),
        skillname: "EBSkill",
        position: "E3",
        status: "Alive",
      },
    })
  );
};

export const attackOrdCalc = (
  teamstats: Array<any>,
  enemystats: Array<any>
) => {
  let attackOrder = teamstats.concat(enemystats);
  attackOrder.sort((a, b) => b.speed - a.speed);
  attackOrder = attackOrder.filter((e) => e.status !== "Dead");

  return attackOrder;
};

export const simEnemyAttack = (
  dispatch: any,
  skillname: string,
  physicalpow: number,
  arcanepow: number,
  attackorder: Array<any>,
  teamstats: Array<any>
) => {
  const skilldamage = getSkillDmg(skillname, physicalpow, arcanepow);
  const target = getSkillTarget(skillname, teamstats);
  dispatch(decrementHealthBy({ row: target, value: skilldamage }));
  attackorder = arrangeAttOrder(attackorder);
  return attackorder;
};

const getSkillTarget = (skillname: string, teamstats: Array<any>) => {
  //get target randomly from alive for enemy use
  const c = teamstats.filter((e) => e.status !== "Dead");
  const e = Math.floor(Math.random() * c.length) + 1;
  return e;
};

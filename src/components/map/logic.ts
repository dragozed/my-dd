import React, { useState } from "react";
import { Action } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  decrementDepth,
  incrementDepth,
  incrementDepthBy,
  selectDepth,
  selectTeam,
  selectEnemy,
  setTeam,
  incrementHealthBy,
  decrementHealthBy,
  decrementEHealthBy,
  setEnemy,
  changeEStatus,
} from "./mapSlice";
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
  enemyrow: number,
  attackorder: Array<any>
) => {
  damageEnemy(dispatch, skillname, enemyrow);
  attackorder = arrangeAttOrder(attackorder);
  return attackorder;
};

const damageEnemy = (dispatch: any, skillname: string, enemyrow: number) => {
  const skilldamage = getSkillDmg(skillname);
  dispatch(decrementEHealthBy({ row: enemyrow, value: skilldamage }));
};

const getSkillDmg = (skillname: string) => {
  if (skillname === "BSkill") {
    return 10;
  } else {
    return 5;
  }
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
        name: "Fronter",
        health: 50,
        speed: 3,
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
        name: "Midder",
        health: 15,
        speed: 12,
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
        name: "Backer",
        health: 5,
        speed: 15,
        skillname: "BSkill",
        position: "T3",
        status: "Alive",
      },
    })
  );
};

const encounterGenerator = (dispatch: any, depth: number) => {
  const k = Math.ceil((depth + 1) / 10); //increased by 1 every 10 levels
  dispatch(
    setEnemy({
      row: 1,
      value: {
        name: "EFrnt",
        health: getRndInteger(20 * k, 30 * k),
        speed: getRndInteger(3 * k, 7 * k),
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
  const attackOrder = teamstats.concat(enemystats);
  attackOrder.sort((a, b) => b.speed - a.speed);
  const currentAtt = setCurrentAtt(attackOrder);
  return attackOrder;
};

const setCurrentAtt = (mergedstats: Array<any>) => {
  const currentAtt = [
    mergedstats[0].position.charAt(0),
    Number(mergedstats[0].position.charAt(1)),
  ];
  return currentAtt;
};

export const simEnemyAttack = (
  dispatch: any,
  skillname: string,
  attackorder: Array<any>,
  teamstats: Array<any>
) => {
  const skilldamage = getSkillDmg(skillname);
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

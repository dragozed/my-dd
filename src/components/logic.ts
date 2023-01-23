import React, { useState } from "react";
import { Action } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../app/hooks";
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
} from "./dungeon/dungeonSlice";
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
  attacker: any,
  enemyrow: number,
  attackorder: Array<any>
) => {
  damageEnemy(dispatch, attacker, enemyrow);
  attackorder = arrangeAttOrder(attackorder);
  return attackorder;
};

const damageEnemy = (dispatch: any, attacker: any, enemyrow: number) => {
  const skilldamage = getSkillDmg(
    attacker.skillname,
    attacker.physicalpow,
    attacker.arcanepow
  );
  dispatch(decrementEHealthBy({ row: enemyrow, value: skilldamage }));
  console.log(
    attacker.name + " dealt " + skilldamage + " damage to row " + enemyrow
  );
};

const arrangeAttOrder = (attackorder: Array<any>) => {
  attackorder.push(attackorder[0]);
  attackorder.shift();
  return attackorder;
};

export const generateFloor = (
  dispatch: any,
  depth: number,
  character1: { name: string; armour: string },
  character2: { name: string; armour: string },
  character3: { name: string; armour: string },
  setEncounter: any
) => {
  teamGenerator(dispatch, character1, character2, character3);
  encounterGenerator(dispatch, depth, setEncounter);
};

export const teamGenerator = (
  dispatch: any,
  character1: { name: string; armour: string },
  character2: { name: string; armour: string },
  character3: { name: string; armour: string }
) => {
  dispatch(
    setTeam({
      row: 1,
      value: getCharacterStats(character1.name, character1.armour),
    })
  );
  dispatch(
    setTeam({
      row: 2,
      value: getCharacterStats(character2.name, character2.armour),
    })
  );
  dispatch(
    setTeam({
      row: 3,
      value: getCharacterStats(character3.name, character3.armour),
    })
  );
};

export const rewardGenerator = (encounter: string, depth: number) => {
  if (encounter === "Combat") {
    const k = Math.ceil((depth + 1) / 10); //increased by 1 every 10 levels
    const gold = getRndInteger(5 * k, 15 * k);
    return { Gold: gold };
  } else return { Gold: 0 };
};
export const encounterGenerator = (
  dispatch: any,
  depth: number,
  setEncounter: any
) => {
  dispatch(setDepth(depth));
  dispatch(
    setEnemy({
      row: 1,
      value: {
        name: "EFrnt",
        health: 9999,
        speed: 9999,
        physicalpow: 9999,
        arcanepow: 9999,
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
        health: 9999,
        speed: 9999,
        physicalpow: 9999,
        arcanepow: 9999,
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
        health: 9999,
        speed: 9999,
        physicalpow: 9999,
        arcanepow: 9999,
        skillname: "EBSkill",
        position: "E3",
        status: "Alive",
      },
    })
  );
  const rnd = getRndInteger(1, 1000);
  if (rnd <= 1000) {
    setEncounter("Combat");
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
  } else {
    setEncounter("Zort");
  }
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
  attacker: any,
  attackorder: Array<any>,
  teamstats: Array<any>
) => {
  const skilldamage = getSkillDmg(
    attacker.skillname,
    attacker.physicalpow,
    attacker.arcanepow
  );
  const target = getSkillTarget(attacker.skillname, teamstats);
  dispatch(decrementHealthBy({ row: target, value: skilldamage }));
  console.log(
    attacker.name + " dealt " + skilldamage + " damage to row " + target
  );
  attackorder = arrangeAttOrder(attackorder);
  return attackorder;
};

const getSkillTarget = (skillname: string, teamstats: Array<any>) => {
  //get target randomly from alive for enemy use
  const c = teamstats.filter((e) => e.status !== "Dead");
  const e = c[Math.floor(Math.random() * c.length)].position.charAt(1);
  return e;
};

/*---------------------LIBRARIES---------------------*/

interface CharacterLibrary {
  [name: string]: {
    name: string;
    health: number;
    speed: number;
    physicalpow: number;
    arcanepow: number;
    skillname: string;
    position: string;
    status: "Alive";
  };
}
interface ArmourLibrary {
  [name: string]: { health: number; speed: number };
}
const getCharacterStats = (characterName: string, armourName: string) => {
  const characterLib: CharacterLibrary = {
    Harold: {
      name: "Harold",
      health: 50,
      speed: 3,
      physicalpow: 10,
      arcanepow: 0,
      skillname: "FSkill",
      position: "T1",
      status: "Alive",
    },
    Terra: {
      name: "Terra",
      health: 15,
      speed: 12,
      physicalpow: 15,
      arcanepow: 0,
      skillname: "MSkill",
      position: "T2",
      status: "Alive",
    },
    Lilith: {
      name: "Lilith",
      health: 5,
      speed: 15,
      physicalpow: 0,
      arcanepow: 10,
      skillname: "BSkill",
      position: "T3",
      status: "Alive",
    },
  };
  const armourLib: ArmourLibrary = {
    None: { health: 0, speed: 0 },
    DeadMansArmour: { health: 10, speed: 0 },
    ClothRobe: { health: 0, speed: 5 },
  };
  return {
    name: characterLib[characterName].name,
    health: characterLib[characterName].health + armourLib[armourName].health,
    speed: characterLib[characterName].speed + armourLib[armourName].speed,
    physicalpow: characterLib[characterName].physicalpow,
    arcanepow: characterLib[characterName].arcanepow,
    skillname: characterLib[characterName].skillname,
    position: characterLib[characterName].position,
    status: characterLib[characterName].status,
  };
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

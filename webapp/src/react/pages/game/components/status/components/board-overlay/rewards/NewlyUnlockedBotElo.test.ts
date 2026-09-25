import type {BeatenBySide, BeatenLadders} from "@src/redux/progress/types/ProgressSliceState";
import type {GameStatus} from "@src/react/pages/game/components/status/utils/GameStatusOf";
import type {Opponent} from "@src/redux/game/types/Opponent";
import {expect, it} from "vitest";
import {freshProgress} from "@src/redux/progress/fresh-progress/FreshProgress";
import {newlyUnlockedBotElo} from "@src/react/pages/game/components/status/components/board-overlay/rewards/NewlyUnlockedBotElo";

const WON: GameStatus = {kind: "won", by: "cho"};
const bot: Opponent = {name: "Bot", botElo: 800, sideChoice: "Cho", playerSide: "cho"};

it("offers the next strength up on a win that has just opened it", () => {
  expect(newlyUnlockedBotElo({status: WON, opponent: bot, format: "Casual", beaten: beatenAsCho([800])})).toBe(1000);
});

it("offers it after a win on points too", () => {
  const status: GameStatus = {kind: "wonOnPoints", by: "cho"};

  expect(newlyUnlockedBotElo({status, opponent: bot, format: "Casual", beaten: beatenAsCho([800])})).toBe(1000);
});

it("offers nothing where the next strength up had been beaten already", () => {
  const beaten = beatenAsCho([800, 1000]);

  expect(newlyUnlockedBotElo({status: WON, opponent: bot, format: "Casual", beaten})).toBeUndefined();
});

it("offers nothing on a loss", () => {
  const status: GameStatus = {kind: "won", by: "han"};

  expect(newlyUnlockedBotElo({status, opponent: bot, format: "Casual", beaten: beatenAsCho([800])})).toBeUndefined();
});

it("offers nothing on a draw", () => {
  const status: GameStatus = {kind: "drawn", by: "bikjang"};

  expect(newlyUnlockedBotElo({status, opponent: bot, format: "Casual", beaten: beatenAsCho([800])})).toBeUndefined();
});

it("offers nothing while the game goes on", () => {
  const status: GameStatus = {kind: "toMove", side: "cho"};

  expect(newlyUnlockedBotElo({status, opponent: bot, format: "Casual", beaten: beatenAsCho([800])})).toBeUndefined();
});

it("offers nothing after beating the strongest bot", () => {
  const strongest: Opponent = {...bot, botElo: 2850};
  const beaten = beatenAsCho([800, 1000, 1200, 1400, 1600, 1900, 2200, 2850]);

  expect(newlyUnlockedBotElo({status: WON, opponent: strongest, format: "Casual", beaten})).toBeUndefined();
});

it("offers nothing between two people", () => {
  const human: Opponent = {...bot, name: "Human"};

  expect(
    newlyUnlockedBotElo({status: WON, opponent: human, format: "Casual", beaten: beatenAsCho([800])}),
  ).toBeUndefined();
});

it("offers nothing on a random side the other army has not reached", () => {
  const random: Opponent = {...bot, sideChoice: "Random"};

  expect(
    newlyUnlockedBotElo({status: WON, opponent: random, format: "Casual", beaten: beatenAsCho([800])}),
  ).toBeUndefined();
});

it("offers the next strength up on a random side where both armies have reached it", () => {
  const random: Opponent = {...bot, sideChoice: "Random"};
  const beaten = beatenIn("Casual", {cho: [800], han: [800]});

  expect(newlyUnlockedBotElo({status: WON, opponent: random, format: "Casual", beaten})).toBe(1000);
});

function beatenAsCho(elos: BeatenBySide["cho"]): BeatenLadders {
  return beatenIn("Casual", {cho: elos, han: []});
}

function beatenIn(format: keyof BeatenLadders, ladders: BeatenBySide): BeatenLadders {
  return {...freshProgress().beaten, [format]: ladders};
}

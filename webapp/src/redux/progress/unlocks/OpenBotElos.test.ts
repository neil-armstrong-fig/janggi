import type {BeatenBySide, BeatenLadders} from "@src/redux/progress/types/ProgressSliceState";
import {BOT_ELOS} from "@janggi/shared/janggi/settings/BotElo";
import {expect, it} from "vitest";
import {freshProgress} from "@src/redux/progress/fresh-progress/FreshProgress";
import {openBotElos} from "@src/redux/progress/unlocks/OpenBotElos";

const NOTHING_BEATEN = freshProgress().beaten;

it("opens only the weakest bot on a ladder nothing has been beaten on", () => {
  expect(openBotElos(NOTHING_BEATEN, "Casual", "Cho")).toEqual([800]);
  expect(openBotElos(NOTHING_BEATEN, "Scored", "Han")).toEqual([800]);
});

it("opens the rung above the one beaten, and no further", () => {
  expect(openBotElos(beatenIn({cho: [800], han: []}), "Casual", "Cho")).toEqual([800, 1000]);
  expect(openBotElos(beatenIn({cho: [800, 1000], han: []}), "Casual", "Cho")).toEqual([800, 1000, 1200]);
});

it("stops at the first rung not beaten, however high the ladder names", () => {
  expect(openBotElos(beatenIn({cho: [1600, 2850], han: []}), "Casual", "Cho")).toEqual([800]);
  expect(openBotElos(beatenIn({cho: [800, 1600], han: []}), "Casual", "Cho")).toEqual([800, 1000]);
});

it("opens every strength once every rung has been beaten", () => {
  expect(openBotElos(beatenIn({cho: [...BOT_ELOS], han: []}), "Casual", "Cho")).toEqual(BOT_ELOS);
});

it("keeps each army's ladder apart", () => {
  expect(openBotElos(beatenIn({cho: [800, 1000], han: []}), "Casual", "Han")).toEqual([800]);
});

it("keeps each format's ladders apart", () => {
  const climbedInCasual = beatenIn({cho: [800, 1000], han: [800]});

  expect(openBotElos(climbedInCasual, "Scored", "Cho")).toEqual([800]);
  expect(openBotElos(climbedInCasual, "Scored", "Han")).toEqual([800]);
});

it("climbs the scored ladder on scored wins alone", () => {
  const climbedInScored: BeatenLadders = {Casual: {cho: [], han: []}, Scored: {cho: [800], han: []}};

  expect(openBotElos(climbedInScored, "Scored", "Cho")).toEqual([800, 1000]);
  expect(openBotElos(climbedInScored, "Casual", "Cho")).toEqual([800]);
});

it("offers Random only the strengths both armies have reached", () => {
  expect(openBotElos(beatenIn({cho: [800, 1000], han: [800]}), "Casual", "Random")).toEqual([800, 1000]);
});

function beatenIn(casual: BeatenBySide): BeatenLadders {
  return {Casual: casual, Scored: {cho: [], han: []}};
}

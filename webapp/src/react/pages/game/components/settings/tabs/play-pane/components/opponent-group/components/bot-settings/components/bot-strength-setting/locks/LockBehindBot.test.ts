import type {BeatenBySide, BeatenLadders} from "@src/redux/slices/progress/types/ProgressSliceState";
import {expect, it} from "vitest";
import {lockBehindBot} from "@src/react/pages/game/components/settings/tabs/play-pane/components/opponent-group/components/bot-settings/components/bot-strength-setting/locks/LockBehindBot";

it("is no lock on a strength the chosen army has reached in this format", () => {
  expect(lockBehindBot(1000, beatenInCasual({cho: [800], han: []}), "Casual", "Cho")).toBeUndefined();
});

it("names the rung beneath the one locked, and the army to beat it with", () => {
  expect(lockBehindBot(1000, beatenInCasual({cho: [], han: []}), "Casual", "Cho")).toEqual({
    beneath: 800,
    choice: "Cho",
    format: "Casual",
  });
  expect(lockBehindBot(1200, beatenInCasual({cho: [800], han: [800]}), "Casual", "Han")).toEqual({
    beneath: 1000,
    choice: "Han",
    format: "Casual",
  });
});

/** Each rung naming its own predecessor is what shows a player the cascade. */
it("names the rung beneath however far above the climb the locked strength is", () => {
  const climbedOnce = beatenInCasual({cho: [800], han: []});

  expect(lockBehindBot(1400, climbedOnce, "Casual", "Cho")?.beneath).toBe(1200);
  expect(lockBehindBot(2850, climbedOnce, "Casual", "Cho")?.beneath).toBe(2200);
});

it("names the scored game where that is the one being played", () => {
  expect(lockBehindBot(1000, beatenInCasual({cho: [800, 1000], han: []}), "Scored", "Cho")).toEqual({
    beneath: 800,
    choice: "Cho",
    format: "Scored",
  });
});

it("asks for both armies where the side is Random", () => {
  expect(lockBehindBot(1200, beatenInCasual({cho: [800, 1000], han: [800]}), "Casual", "Random")).toEqual({
    beneath: 1000,
    choice: "Random",
    format: "Casual",
  });
});

function beatenInCasual(casual: BeatenBySide): BeatenLadders {
  return {Casual: casual, Scored: {cho: [], han: []}};
}

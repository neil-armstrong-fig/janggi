import type {BeatenBySide, BeatenLadders} from "@src/redux/progress/types/ProgressSliceState";
import {expect, it} from "vitest";
import {lockBehindBot} from "@src/react/pages/game/components/settings/tabs/game-pane/components/bot-settings/components/bot-strength-setting/locks/LockBehindBot";

it("is no lock on a strength the chosen army has reached in this format", () => {
  expect(lockBehindBot(1000, beatenInCasual({cho: [800], han: []}), "Casual", "Cho")).toBeUndefined();
});

it("names the rung beneath the one locked, and the army to beat it with", () => {
  expect(lockBehindBot(1000, beatenInCasual({cho: [], han: []}), "Casual", "Cho")).toBe(
    "beat 800 as Cho in a casual game first",
  );
  expect(lockBehindBot(1200, beatenInCasual({cho: [800], han: [800]}), "Casual", "Han")).toBe(
    "beat 1000 as Han in a casual game first",
  );
});

/** Each rung naming its own predecessor is what shows a player the cascade. */
it("names the rung beneath however far above the climb the locked strength is", () => {
  const climbedOnce = beatenInCasual({cho: [800], han: []});

  expect(lockBehindBot(1400, climbedOnce, "Casual", "Cho")).toBe("beat 1200 as Cho in a casual game first");
  expect(lockBehindBot(2850, climbedOnce, "Casual", "Cho")).toBe("beat 2200 as Cho in a casual game first");
});

it("names the scored game where that is the one being played", () => {
  expect(lockBehindBot(1000, beatenInCasual({cho: [800, 1000], han: []}), "Scored", "Cho")).toBe(
    "beat 800 as Cho in a scored game first",
  );
});

it("asks for both armies where the side is Random", () => {
  expect(lockBehindBot(1200, beatenInCasual({cho: [800, 1000], han: [800]}), "Casual", "Random")).toBe(
    "beat 1000 with both armies in a casual game first",
  );
});

function beatenInCasual(casual: BeatenBySide): BeatenLadders {
  return {Casual: casual, Scored: {cho: [], han: []}};
}

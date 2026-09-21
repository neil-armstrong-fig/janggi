import {expect, it} from "vitest";
import {unlockLadder} from "@src/redux/progress/unlocks/UnlockLadder";
import {unlockProgressFor} from "@src/react/pages/game/components/xp-bar/unlock-progress/UnlockProgressFor";

it("starts from nothing towards the first unlock", () => {
  expect(unlockProgressFor(0)).toEqual({previousXp: 0, next: {xp: 30, labels: ["Hanja pieces"]}, fraction: 0});
});

it("fills as XP climbs towards the first unlock", () => {
  expect(unlockProgressFor(15)?.fraction).toBe(0.5);
});

it("measures from the unlock last passed, not from nothing", () => {
  expect(unlockProgressFor(900)).toEqual({
    previousXp: 600,
    next: {xp: 1_200, labels: ["Celadon theme"]},
    fraction: 0.5,
  });
});

it("starts empty again on reaching an unlock, having opened it", () => {
  expect(unlockProgressFor(600)).toMatchObject({previousXp: 600, next: {xp: 1_200}, fraction: 0});
});

it("names the same step the ladder lists", () => {
  expect(unlockLadder()).toContainEqual(unlockProgressFor(640)?.next);
});

it("has nothing to fill towards once everything is unlocked", () => {
  expect(unlockProgressFor(1_000_000)).toBeUndefined();
});

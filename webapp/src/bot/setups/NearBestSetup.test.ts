import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {expect, it} from "vitest";
import {nearBestSetup} from "@src/bot/setups/NearBestSetup";

const inner = setupNamed("Inner Elephant");
const outer = setupNamed("Outer Elephant");
const left = setupNamed("Left Elephant");

it("picks the best alone when the rest trail it by more than the margin", () => {
  const ratings = [
    {setup: inner, score: 0},
    {setup: outer, score: 100},
    {setup: left, score: 60},
  ];

  expect([0, 0.5, 0.9999].map(roll => nearBestSetup(ratings, roll))).toEqual([outer, outer, outer]);
});

it("reaches every setup rated within the margin of the best across the roll", () => {
  const ratings = [
    {setup: inner, score: 100},
    {setup: outer, score: 80},
    {setup: left, score: 0},
  ];

  expect([0, 0.9999].map(roll => nearBestSetup(ratings, roll))).toEqual([inner, outer]);
});

it("falls back through the four tournament setups by roll when nothing was rated", () => {
  const picked = [0, 0.25, 0.5, 0.75].map(roll => nearBestSetup([], roll).name);

  expect(picked).toEqual(["Inner Elephant", "Outer Elephant", "Left Elephant", "Right Elephant"]);
});

it("never falls back to the Central Chariot, which is casual play only", () => {
  expect(nearBestSetup([], 0.9999).name).not.toBe("Central Chariot");
});

function setupNamed(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

import {expect, it} from "vitest";
import {secondsPerStep} from "@src/audio/music/mood/SecondsPerStep";

it("moves at a court-music crawl at the opening, each step well over half a second", () => {
  expect(secondsPerStep(0, false)).toBeGreaterThan(0.65);
});

it("quickens as the game grows tense", () => {
  expect(secondsPerStep(0.8, false)).toBeLessThan(secondsPerStep(0.2, false));
});

it("never moves faster than a steady walk while the music is the game's own", () => {
  expect(secondsPerStep(1, false)).toBeGreaterThan(0.4);
});

it("quickens again while a general is attacked", () => {
  expect(secondsPerStep(0.5, true)).toBeLessThan(secondsPerStep(0.5, false));
});

/** The check theme was liked as it was; its pace is pinned so reworking the rest cannot drag it along. */
it("keeps the check theme at the pace it was written at", () => {
  expect(secondsPerStep(0, true)).toBeCloseTo(60 / 74 / 2, 6);
  expect(secondsPerStep(0.5, true)).toBeCloseTo(60 / 85 / 2, 6);
  expect(secondsPerStep(1, true)).toBeCloseTo(60 / 96 / 2, 6);
});

it("never rushes, however tense the game and even in check", () => {
  expect(secondsPerStep(1, true)).toBeGreaterThan(0.3);
});

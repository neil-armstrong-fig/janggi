import {JAJINMORI, JUNGJUNGMORI, JUNGMORI} from "@src/audio/music/rhythm/rhythms/Rhythms";
import type {Mood} from "@src/audio/types/Mood";
import {expect, it} from "vitest";
import {rhythmFor} from "@src/audio/music/rhythm/RhythmFor";
import {secondsPerStep} from "@src/audio/music/mood/SecondsPerStep";

it("drifts unhurried while a game is still being set up, each step over half a second", () => {
  expect(secondsPerStep(waiting(), JUNGMORI)).toBeGreaterThan(0.55);
});

it("walks the opening of a game in 중모리, lively but unhurried", () => {
  const opening = secondsPerStep(game(0), rhythmFor(0));

  expect(opening).toBeGreaterThan(0.38);
  expect(opening).toBeLessThan(0.5);
});

it("presses on a little within a 장단 as the game grows tense", () => {
  expect(secondsPerStep(game(0.3), JUNGMORI)).toBeLessThan(secondsPerStep(game(0), JUNGMORI));
});

it("quickens again with each 장단 the game moves into", () => {
  expect(secondsPerStep(game(0.5), JUNGJUNGMORI)).toBeLessThan(secondsPerStep(game(0.2), JUNGMORI));
  expect(secondsPerStep(game(0.9), JAJINMORI)).toBeLessThan(secondsPerStep(game(0.5), JUNGJUNGMORI));
});

it("never rushes a player, however tense the game", () => {
  expect(secondsPerStep(game(1), JAJINMORI)).toBeGreaterThan(0.28);
});

it("quickens again while a general is attacked", () => {
  expect(secondsPerStep(check(0.5), JUNGJUNGMORI)).toBeLessThan(secondsPerStep(game(0.5), JUNGJUNGMORI));
});

/** The check theme was liked as it was; its pace is pinned so reworking the rest cannot drag it along. */
it("keeps the check theme at the pace it was written at, whatever 장단 is underneath", () => {
  for (const rhythm of [JUNGMORI, JAJINMORI]) {
    expect(secondsPerStep(check(0), rhythm)).toBeCloseTo(60 / 74 / 2, 6);
    expect(secondsPerStep(check(0.5), rhythm)).toBeCloseTo(60 / 85 / 2, 6);
    expect(secondsPerStep(check(1), rhythm)).toBeCloseTo(60 / 96 / 2, 6);
  }
});

it("never rushes, however tense the game and even in check", () => {
  expect(secondsPerStep(check(1), JAJINMORI)).toBeGreaterThan(0.3);
});

function waiting(): Mood {
  return {tension: 0, inCheck: false, ending: "none", underWay: false};
}

function game(tension: number): Mood {
  return {tension, inCheck: false, ending: "none", underWay: true};
}

function check(tension: number): Mood {
  return {tension, inCheck: true, ending: "none", underWay: true};
}

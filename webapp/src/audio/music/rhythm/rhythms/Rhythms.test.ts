import {RHYTHMS, STEPS_PER_ROUND} from "@src/audio/music/rhythm/rhythms/Rhythms";
import {expect, it} from "vitest";

it("fills a round exactly with whole cycles of every 장단", () => {
  for (const {name, beats} of RHYTHMS) {
    const cycle = beats.reduce((sum, length) => sum + length, 0);

    expect({name, fits: STEPS_PER_ROUND % cycle === 0}).toEqual({name, fits: true});
  }
});

it("lands every round on one of the check theme's bar lines", () => {
  expect(STEPS_PER_ROUND % 8).toBe(0);
});

it("covers every tension from calm to tense, one 장단 after another", () => {
  expect(RHYTHMS[0]?.tension.from).toBe(0);
  expect(RHYTHMS.at(-1)?.tension.to).toBe(1);
  RHYTHMS.slice(1).forEach((rhythm, index) => expect(rhythm.tension.from).toBe(RHYTHMS[index]?.tension.to));
});

it("never slows as the music moves into the next 장단", () => {
  RHYTHMS.slice(1).forEach((rhythm, index) => {
    expect(rhythm.stepSeconds.calm).toBeLessThanOrEqual(RHYTHMS[index]?.stepSeconds.tense ?? 0);
    expect(rhythm.stepSeconds.tense).toBeLessThan(rhythm.stepSeconds.calm);
  });
});

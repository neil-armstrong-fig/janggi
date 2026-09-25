import {expect, it} from "vitest";
import {stringPartialsOf} from "@src/audio/instruments/gayageum/StringPartialsOf";

const PLUCK = {frequency: 220, weight: 0.5, length: 1};

it("scales the loudest partial to one", () => {
  const levels = stringPartialsOf(PLUCK).map(partial => partial.level);

  expect(Math.max(...levels)).toBe(1);
});

it("lets the upper partials die faster than the fundamental", () => {
  const decays = stringPartialsOf(PLUCK).map(partial => partial.decay);

  decays.slice(1).forEach((decay, index) => expect(decay).toBeLessThan(decays[index] ?? 0));
});

it("lets the fundamental ring for the whole of the note", () => {
  expect(stringPartialsOf(PLUCK)[0]?.decay).toBe(1);
});

it("never lets a partial die quicker than a click", () => {
  const decays = stringPartialsOf({...PLUCK, length: 0.05}).map(partial => partial.decay);

  expect(Math.min(...decays)).toBeGreaterThanOrEqual(0.06);
});

it("rings the upper partials a little sharp", () => {
  const ratios = stringPartialsOf(PLUCK).map(partial => partial.ratio);

  ratios.forEach((ratio, index) => expect(ratio).toBeGreaterThan(index + 1));
});

it("leaves out the partials that are too high to be worth ringing", () => {
  const partials = stringPartialsOf({...PLUCK, frequency: 2_000});

  expect(partials.every(partial => 2_000 * partial.ratio <= 8_000)).toBe(true);
  expect(partials.length).toBeLessThan(8);
});

it("brings out the upper partials for a harder pluck", () => {
  const soft = stringPartialsOf({...PLUCK, weight: 0});
  const hard = stringPartialsOf({...PLUCK, weight: 1});

  expect(hard[3]?.level ?? 0).toBeGreaterThan(soft[3]?.level ?? 1);
});

it("thins out the partials that have a node near where the string is plucked", () => {
  const levels = stringPartialsOf(PLUCK).map(partial => partial.level);

  expect(levels[5]).toBeLessThan((levels[4] ?? 0) / 2);
});

it("rings the second partial, as a string plucked off its middle does", () => {
  const [fundamental, second] = stringPartialsOf(PLUCK);

  expect(second?.level ?? 0).toBeGreaterThan((fundamental?.level ?? 1) / 2);
});

it("keeps the upper partials brighter and longer-ringing with an edge", () => {
  const plain = stringPartialsOf(PLUCK);
  const edged = stringPartialsOf({...PLUCK, edge: 1});

  expect(edged[3]?.level ?? 0).toBeGreaterThan(plain[3]?.level ?? 1);
  expect(edged[3]?.decay ?? 0).toBeGreaterThan(plain[3]?.decay ?? 1);
});

import {LAYER_NAMES} from "@src/audio/music/types/LayerName";
import type {Mood} from "@src/audio/types/Mood";
import {expect, it} from "vitest";
import {layerGainsFor} from "@src/audio/music/mood/LayerGainsFor";

it("plays only the waiting theme, over a softer bass, before a game is under way", () => {
  const waiting = layerGainsFor({tension: 0, inCheck: false, ending: "none", underWay: false});

  expect(waiting.waiting).toBe(1);
  expect(waiting.bass).toBeGreaterThan(0);
  expect(waiting.bass).toBeLessThan(layerGainsFor(calm(0)).bass);
  expect({...waiting, waiting: 0, bass: 0}).toEqual(SILENT);
});

it("hands the waiting theme over to the game's own music once a game is under way", () => {
  expect(layerGainsFor(calm(0)).waiting).toBe(0);
  expect(layerGainsFor({tension: 0.5, inCheck: true, ending: "none", underWay: true}).waiting).toBe(0);
});

it("plays the bass, the soloist and a soft drum from the first move, and nothing else", () => {
  expect(layerGainsFor(calm(0))).toEqual({waiting: 0, bass: 1, solo: 0.7, janggu: 0.4, answer: 0, checkTheme: 0});
});

it("never lets a layer fall away as tension rises", () => {
  const sweep = Array.from({length: 101}, (_, step) => layerGainsFor(calm(step / 100)));

  for (const layer of LAYER_NAMES) {
    sweep.slice(1).forEach((gains, index) => {
      expect({layer, gain: gains[layer] >= (sweep[index]?.[layer] ?? 0)}).toEqual({layer, gain: true});
    });
  }
});

it("brings the flute in only once the fight has opened", () => {
  expect(layerGainsFor(calm(0.3)).answer).toBe(0);
  expect(layerGainsFor(calm(0.5)).answer).toBeGreaterThan(0);
});

it("has every layer of the game's own music playing in full once it is as tense as it gets", () => {
  expect(layerGainsFor(calm(1))).toEqual({waiting: 0, bass: 1, solo: 1, janggu: 1, answer: 1, checkTheme: 0});
});

it("swells smoothly, never jumping more than a little for a small rise in tension", () => {
  for (let step = 1; step <= 100; step += 1) {
    const before = layerGainsFor(calm((step - 1) / 100));
    const after = layerGainsFor(calm(step / 100));

    for (const layer of LAYER_NAMES) expect(after[layer] - before[layer]).toBeLessThanOrEqual(0.05);
  }
});

it("hands the music to the check theme during check", () => {
  expect(layerGainsFor({tension: 0.5, inCheck: true, ending: "none", underWay: true}).checkTheme).toBe(1);
});

/** So the game's own music is still there to come back up once the check is answered. */
it("keeps the game's own music quietly underneath the check theme rather than stopping it", () => {
  const underCheck = layerGainsFor({tension: 0.5, inCheck: true, ending: "none", underWay: true});
  const without = layerGainsFor(calm(0.5));

  expect(underCheck.bass).toBeGreaterThan(0);
  expect(underCheck.bass).toBeLessThan(without.bass);
  expect(underCheck.solo).toBeLessThan(without.solo);
});

it("lets all of the music go once the game has ended", () => {
  expect(layerGainsFor({tension: 0.9, inCheck: false, ending: "won", underWay: true})).toEqual(SILENT);
});

function calm(tension: number): Mood {
  return {tension, inCheck: false, ending: "none", underWay: true};
}

const SILENT = {waiting: 0, bass: 0, solo: 0, janggu: 0, answer: 0, checkTheme: 0};

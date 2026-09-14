import {LAYER_NAMES} from "@src/audio/music/types/LayerName";
import type {Mood} from "@src/audio/types/Mood";
import {expect, it} from "vitest";
import {layerGainsFor} from "@src/audio/music/mood/LayerGainsFor";

it("plays the drone and a soft lead at the opening, and nothing else", () => {
  expect(layerGainsFor(calm(0))).toEqual({
    drone: 1,
    lead: 0.5,
    pulse: 0,
    echo: 0,
    percussion: 0,
    checkTheme: 0,
  });
});

it("never lets a layer fall away as tension rises", () => {
  const sweep = Array.from({length: 101}, (_, step) => layerGainsFor(calm(step / 100)));

  for (const layer of LAYER_NAMES) {
    sweep.slice(1).forEach((gains, index) => {
      expect({layer, gain: gains[layer] >= (sweep[index]?.[layer] ?? 0)}).toEqual({layer, gain: true});
    });
  }
});

it("brings the layers in one after another, the drums before the echo and the echo before the fuller drumming", () => {
  const firstHeard = (layer: "pulse" | "echo" | "percussion"): number =>
    Array.from({length: 101}, (_, step) => step / 100).find(tension => layerGainsFor(calm(tension))[layer] > 0) ?? 2;

  expect(firstHeard("pulse")).toBeLessThan(firstHeard("echo"));
  expect(firstHeard("echo")).toBeLessThan(firstHeard("percussion"));
});

it("has every layer of the game's own music playing in full once it is as tense as it gets", () => {
  expect(layerGainsFor(calm(1))).toEqual({drone: 1, lead: 1, pulse: 1, echo: 1, percussion: 1, checkTheme: 0});
});

it("swells smoothly, never jumping more than a little for a small rise in tension", () => {
  for (let step = 1; step <= 100; step += 1) {
    const before = layerGainsFor(calm((step - 1) / 100));
    const after = layerGainsFor(calm(step / 100));

    for (const layer of LAYER_NAMES) expect(after[layer] - before[layer]).toBeLessThanOrEqual(0.05);
  }
});

it("hands the music to the check theme during check", () => {
  expect(layerGainsFor({tension: 0.5, inCheck: true, ending: "none"}).checkTheme).toBe(1);
});

/** So the game's own music is still there to come back up once the check is answered. */
it("keeps the game's own music quietly underneath the check theme rather than stopping it", () => {
  const underCheck = layerGainsFor({tension: 0.5, inCheck: true, ending: "none"});
  const without = layerGainsFor(calm(0.5));

  expect(underCheck.drone).toBeGreaterThan(0);
  expect(underCheck.drone).toBeLessThan(without.drone);
  expect(underCheck.pulse).toBeLessThan(without.pulse);
});

it("lets everything go but a quiet drone once the game has ended", () => {
  const ended = layerGainsFor({tension: 0.9, inCheck: false, ending: "won"});

  expect(ended.drone).toBeGreaterThan(0);
  expect(ended.drone).toBeLessThan(1);
  expect({...ended, drone: 0}).toEqual({drone: 0, lead: 0, pulse: 0, echo: 0, percussion: 0, checkTheme: 0});
});

function calm(tension: number): Mood {
  return {tension, inCheck: false, ending: "none"};
}

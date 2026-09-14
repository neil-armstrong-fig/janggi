import {expect, it} from "vitest";
import {heartbeatHitsAt} from "@src/audio/music/patterns/HeartbeatHitsAt";

it("beats twice a bar, each a strong stroke followed at once by a weaker one", () => {
  for (const beat of [0, 4]) {
    const strong = heartbeatHitsAt(beat)[0]?.weight ?? 0;
    const weak = heartbeatHitsAt(beat + 1)[0]?.weight ?? 0;

    expect(weak).toBeGreaterThan(0);
    expect(strong).toBeGreaterThan(weak);
  }
});

it("beats on the low head only", () => {
  const heads = Array.from({length: 8}, (_, step) => heartbeatHitsAt(step).map(({head}) => head)).flat();

  expect(new Set(heads)).toEqual(new Set(["gung"]));
});

it("is silent between the beats", () => {
  for (const step of [2, 3, 6, 7]) expect(heartbeatHitsAt(step)).toEqual([]);
});

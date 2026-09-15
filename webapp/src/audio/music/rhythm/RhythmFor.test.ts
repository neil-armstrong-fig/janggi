import {expect, it} from "vitest";
import {rhythmFor} from "@src/audio/music/rhythm/RhythmFor";

it("opens a game in 중모리", () => {
  expect(rhythmFor(0).name).toBe("jungmori");
});

it("moves into 중중모리 as the fight opens", () => {
  expect(rhythmFor(0.5).name).toBe("jungjungmori");
});

it("drives in 자진모리 at the height of the fight", () => {
  expect(rhythmFor(0.8).name).toBe("jajinmori");
  expect(rhythmFor(1).name).toBe("jajinmori");
});

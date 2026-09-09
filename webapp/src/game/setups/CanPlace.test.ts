import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import type {SetupPhase} from "@src/game/setups/types/SetupPhase";
import {canPlace} from "@src/game/setups/CanPlace";
import {expect, it} from "vitest";
import {setupPhaseFor} from "@src/game/setups/SetupPhaseFor";

const inner = setup("Inner Elephant");

it("lets either army lay out first in a casual game", () => {
  const phase = setupPhaseFor("Casual");

  expect(canPlace(phase, "han")).toBe(true);
  expect(canPlace(phase, "cho")).toBe(true);
});

it("lets a casual army lay out again after it already has", () => {
  const phase: SetupPhase = {...setupPhaseFor("Casual"), hanSetup: inner, choSetup: inner};

  expect(canPlace(phase, "han")).toBe(true);
  expect(canPlace(phase, "cho")).toBe(true);
});

it("has han lay out first in a scored game", () => {
  expect(canPlace(setupPhaseFor("Scored"), "han")).toBe(true);
});

it("makes cho wait, because cho is the one who answers", () => {
  expect(canPlace(setupPhaseFor("Scored"), "cho")).toBe(false);
});

/** "이때 후수자는 馬와 象의 배치를 바꿔 다시 차릴 수 없다" — han lays out once and lives with it. */
it("refuses han a second arrangement once it has laid out", () => {
  expect(canPlace({...setupPhaseFor("Scored"), hanSetup: inner}, "han")).toBe(false);
});

it("lets cho answer once han has laid out", () => {
  expect(canPlace({...setupPhaseFor("Scored"), hanSetup: inner}, "cho")).toBe(true);
});

/** One of the three privileges the 1.5 덤 pays for — `docs/opening-setups.md` §4. */
it("lets cho change its mind, having already answered", () => {
  const phase: SetupPhase = {...setupPhaseFor("Scored"), hanSetup: inner, choSetup: inner};

  expect(canPlace(phase, "cho")).toBe(true);
});

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import type {SetupPhase} from "@src/game/setups/types/SetupPhase";
import {expect, it} from "vitest";
import {place} from "@src/game/setups/Place";
import {setupPhaseFor} from "@src/game/setups/SetupPhaseFor";

const inner = setup("Inner Elephant");
const outer = setup("Outer Elephant");

it("records the arrangement the army chose", () => {
  expect(place(setupPhaseFor("Casual"), "han", inner).hanSetup).toBe(inner);
  expect(place(setupPhaseFor("Casual"), "cho", inner).choSetup).toBe(inner);
});

it("leaves the other army and the format alone", () => {
  const placed = place(setupPhaseFor("Scored"), "han", inner);

  expect(placed.choSetup).toBeUndefined();
  expect(placed.format).toBe("Scored");
});

it("replaces an earlier choice rather than keeping both", () => {
  const phase = place(place(setupPhaseFor("Casual"), "cho", inner), "cho", outer);

  expect(phase.choSetup).toBe(outer);
});

it("hands back a new phase rather than changing the one it was given", () => {
  const phase = setupPhaseFor("Casual");

  place(phase, "han", inner);

  expect(phase.hanSetup).toBeUndefined();
});

it("throws when cho tries to answer a board han has not laid out", () => {
  expect(() => place(setupPhaseFor("Scored"), "cho", inner)).toThrow(/han lays out first/);
});

it("throws when han reaches for a second arrangement in a scored game", () => {
  const phase: SetupPhase = {...setupPhaseFor("Scored"), hanSetup: inner};

  expect(() => place(phase, "han", outer)).toThrow(/may not lay out again/);
});

it("does not throw on a casual re-arrangement, which no rule forbids", () => {
  const phase: SetupPhase = {...setupPhaseFor("Casual"), hanSetup: inner};

  expect(() => place(phase, "han", outer)).not.toThrow();
});

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

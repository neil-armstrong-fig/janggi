import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {expect, it} from "vitest";
import {isArranged} from "@src/game/setups/IsArranged";
import {setupPhaseFor} from "@src/game/setups/SetupPhaseFor";

const inner = setup("Inner Elephant");

it("is not laid out while neither army has chosen", () => {
  expect(isArranged(setupPhaseFor("Casual"))).toBe(false);
});

it("is not laid out while only han has chosen", () => {
  expect(isArranged({...setupPhaseFor("Casual"), hanSetup: inner})).toBe(false);
});

it("is not laid out while only cho has chosen", () => {
  expect(isArranged({...setupPhaseFor("Casual"), choSetup: inner})).toBe(false);
});

it("is laid out once both armies have chosen", () => {
  expect(isArranged({...setupPhaseFor("Casual"), hanSetup: inner, choSetup: inner})).toBe(true);
});

/** The order is the scored game's rule; having both back ranks is what makes a board. */
it("asks the same question of either format", () => {
  expect(isArranged({...setupPhaseFor("Scored"), hanSetup: inner, choSetup: inner})).toBe(true);
});

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

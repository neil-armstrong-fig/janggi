import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {elephantPairingOf} from "@src/game/setups/ElephantPairingOf";
import {expect, it} from "vitest";

const inner = setup("Inner Elephant");
const outer = setup("Outer Elephant");
const left = setup("Left Elephant");
const right = setup("Right Elephant");
const central = setup("Central Chariot");

it("calls two left elephants eotsang, both armies' outer elephant on one wing", () => {
  expect(elephantPairingOf(left, left)).toBe("eotsang");
});

it("calls two right elephants eotsang as well", () => {
  expect(elephantPairingOf(right, right)).toBe("eotsang");
});

it("calls left against right matsang, the outer elephants coming to face each other", () => {
  expect(elephantPairingOf(left, right)).toBe("matsang");
});

it("calls right against left matsang too", () => {
  expect(elephantPairingOf(right, left)).toBe("matsang");
});

/**
 * The classification is only defined for two 귀마 arrangements — `docs/opening-setups.md` §7's table
 * is titled for them and covers nothing else. A setup whose elephants mirror about the middle file
 * develops on neither wing in particular, so there is nothing to face or not face.
 */
it("says nothing when either army's elephants mirror about the middle file", () => {
  expect(elephantPairingOf(inner, left)).toBeUndefined();
  expect(elephantPairingOf(left, outer)).toBeUndefined();
  expect(elephantPairingOf(inner, outer)).toBeUndefined();
  expect(elephantPairingOf(central, central)).toBeUndefined();
});

/** Four of the twenty-five pairs, and it is losing the mirror guard that would make it twenty-five. */
it("classifies exactly the four gwima pairings out of twenty-five", () => {
  const classified = SETUPS.flatMap(han => SETUPS.map(cho => elephantPairingOf(han, cho))).filter(Boolean);

  expect(classified).toHaveLength(4);
});

/** A shape, not a claim about either player, so which army is named first cannot matter. */
it("does not care which army is asked about first", () => {
  for (const han of SETUPS) {
    for (const cho of SETUPS) {
      expect(elephantPairingOf(han, cho)).toBe(elephantPairingOf(cho, han));
    }
  }
});

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

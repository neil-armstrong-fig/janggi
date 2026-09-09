import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import type {SetupPhase} from "@src/game/setups/types/SetupPhase";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";
import {newGameFrom} from "@src/game/setups/NewGameFrom";
import {setupPhaseFor} from "@src/game/setups/SetupPhaseFor";

const inner = setup("Inner Elephant");
const left = setup("Left Elephant");

it("throws while neither army has laid out", () => {
  expect(() => newGameFrom(setupPhaseFor("Casual"))).toThrow(/both armies/);
});

it("throws while only han has laid out", () => {
  expect(() => newGameFrom({...setupPhaseFor("Casual"), hanSetup: inner})).toThrow(/both armies/);
});

it("throws while only cho has laid out", () => {
  expect(() => newGameFrom({...setupPhaseFor("Casual"), choSetup: inner})).toThrow(/both armies/);
});

it("carries the format the phase was laid out for", () => {
  expect(newGameFrom(laidOut("Scored", inner, inner)).format).toBe("Scored");
});

/**
 * Stands each army on its OWN choice, which an asymmetric pair is what proves — with the same setup
 * twice, the two arguments could be swapped and nothing would show it.
 */
it("stands each army on the arrangement it chose", () => {
  const {pieces} = newGameFrom(laidOut("Casual", left, inner));

  expect(typeAt(pieces, 2, 1)).toBe("elephant");
  expect(typeAt(pieces, 2, 10)).toBe("horse");
});

/**
 * The integration assertion tying the setup phase to the door that was already there. Exhaustive at
 * twenty-five pairs, so the two routes to a new game cannot drift apart.
 */
it("deals the very game newGame deals, for every pair of arrangements", () => {
  for (const hanSetup of SETUPS) {
    for (const choSetup of SETUPS) {
      expect(newGameFrom(laidOut("Casual", hanSetup, choSetup))).toEqual(newGame(hanSetup, choSetup, "Casual"));
    }
  }
});

function laidOut(format: SetupPhase["format"], hanSetup: Setup, choSetup: Setup): SetupPhase {
  return {...setupPhaseFor(format), hanSetup, choSetup};
}

function typeAt(pieces: ReturnType<typeof newGame>["pieces"], file: number, rank: number): string | undefined {
  return pieces.find(({position}) => position.file === file && position.rank === rank)?.piece.type;
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

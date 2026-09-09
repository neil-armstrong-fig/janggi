import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {dealtGame} from "@src/redux/game/utils/DealtGame";
import {expect, it} from "vitest";

const inner = setup("Inner Elephant");
const outer = setup("Outer Elephant");

it("deals both armies onto the board in full", () => {
  expect(dealtGame(inner, inner, "Casual").played.present.pieces).toHaveLength(32);
});

it("gives cho the first move", () => {
  expect(dealtGame(inner, inner, "Casual").played.present.sideToMove).toBe("cho");
});

it("starts a game nobody has moved in yet, with nothing to take back or play again", () => {
  expect(dealtGame(inner, inner, "Casual").played.past).toEqual([]);
  expect(dealtGame(inner, inner, "Casual").played.future).toEqual([]);
});

it("remembers the two setups it dealt from, so the game can be dealt again", () => {
  const dealt = dealtGame(inner, outer, "Casual");

  expect(dealt.hanSetup).toBe(inner);
  expect(dealt.choSetup).toBe(outer);
});

/** Which of the two games is being played is dealt with the setups, and the position carries it. */
it("deals the game in the format it was asked for, and says so both ways", () => {
  const dealt = dealtGame(inner, inner, "Scored");

  expect(dealt.format).toBe("Scored");
  expect(dealt.played.present.format).toBe("Scored");
});

/** Han's back rank is rank 1 and Cho's is rank 10; the inner setup puts an elephant on file 3, the
 * outer one on file 2. Each army being arranged by its own choice is the whole point of two
 * pickers. */
it("arranges each army by its own setup rather than by one of them twice", () => {
  const dealt = dealtGame(inner, outer, "Casual");

  expect(typeAt(dealt, 3, 1)).toBe("elephant");
  expect(typeAt(dealt, 2, 10)).toBe("elephant");
});

it("deals a new game every time rather than handing back the one before", () => {
  const first = dealtGame(inner, inner, "Casual");
  const second = dealtGame(inner, inner, "Casual");

  expect(second).not.toBe(first);
  expect(second).toEqual(first);
});

function typeAt(state: GameSliceState, file: number, rank: number): PieceType | undefined {
  return state.played.present.pieces.find(({position}) => position.file === file && position.rank === rank)?.piece.type;
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

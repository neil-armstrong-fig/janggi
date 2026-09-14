import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import type {SetupPhase} from "@src/game/setups/types/SetupPhase";
import {dealtGame} from "@src/redux/game/dealing/DealtGame";
import {expect, it} from "vitest";
import {place} from "@src/game/setups/Place";
import {setupPhaseFor} from "@src/game/setups/SetupPhaseFor";

const inner = setup("Inner Elephant");
const outer = setup("Outer Elephant");

it("deals both armies onto the board in full", () => {
  expect(dealtGame(laidOut(inner, inner)).played.present.pieces).toHaveLength(32);
});

it("gives cho the first move", () => {
  expect(dealtGame(laidOut(inner, inner)).played.present.sideToMove).toBe("cho");
});

it("starts a game nobody has moved in yet, with nothing to take back or play again", () => {
  expect(dealtGame(laidOut(inner, inner)).played.past).toEqual([]);
  expect(dealtGame(laidOut(inner, inner)).played.future).toEqual([]);
});

it("keeps the phase it dealt from, so the pickers know what has been chosen", () => {
  const dealt = dealtGame(laidOut(inner, outer));

  expect(dealt.phase.hanSetup).toBe(inner);
  expect(dealt.phase.choSetup).toBe(outer);
});

/** Which of the two games is being played is dealt with the setups, and the position carries it. */
it("deals the game in the format it was asked for, and says so both ways", () => {
  const dealt = dealtGame(laidOut(inner, inner, "Scored"));

  expect(dealt.phase.format).toBe("Scored");
  expect(dealt.played.present.format).toBe("Scored");
});

/** Han's back rank is rank 1 and Cho's is rank 10; the inner setup puts an elephant on file 3, the
 * outer one on file 2. Each army being arranged by its own choice is the whole point of two
 * pickers. */
it("arranges each army by its own setup rather than by one of them twice", () => {
  const dealt = dealtGame(laidOut(inner, outer));

  expect(typeAt(dealt, 3, 1)).toBe("elephant");
  expect(typeAt(dealt, 2, 10)).toBe("elephant");
});

it("deals a new game every time rather than handing back the one before", () => {
  const first = dealtGame(laidOut(inner, inner));
  const second = dealtGame(laidOut(inner, inner));

  expect(second).not.toBe(first);
  expect(second).toEqual(first);
});

/**
 * A scored board mid-arrangement still has to be drawn, so a full board comes back — with the army
 * that has chosen standing on its own choice and the one that has not on the common arrangement.
 * The phase keeps saying nobody chose for cho, which is what the pickers read.
 */
it("deals a board to look at while a scored game is still being laid out", () => {
  const dealt = dealtGame(place(setupPhaseFor("Scored"), "han", outer));

  expect(dealt.played.present.pieces).toHaveLength(32);
  expect(typeAt(dealt, 2, 1)).toBe("elephant");
  expect(typeAt(dealt, 3, 10)).toBe("elephant");
  expect(dealt.phase.choSetup).toBeUndefined();
});

function laidOut(hanSetup: Setup, choSetup: Setup, format: SetupPhase["format"] = "Casual"): SetupPhase {
  return place(place(setupPhaseFor(format), "han", hanSetup), "cho", choSetup);
}

function typeAt(state: GameSliceState, file: number, rank: number): PieceType | undefined {
  return state.played.present.pieces.find(({position}) => position.file === file && position.rank === rank)?.piece.type;
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Standing} from "@src/game/types/Standing";
import {RANKS} from "@src/game/board/BoardDimensions";
import {expect, it} from "vitest";
import {isRepetition} from "@src/game/repetition/IsRepetition";
import {standingOf} from "@src/game/utils/StandingOf";
import {placed} from "@src/testing/Placed";

/**
 * "동일한 수를 3회 이상 반복할 수 없다" — a position standing a third time. It **reports**: the
 * exemption below thirty points a side is asked where a move is refused, not here. See
 * `docs/rules.md` §6.4.
 *
 * `seen` holds what the game has left behind, so the position it stands in is a third standing when
 * its own standing is already in there twice. The positions padding these tests out are stand-ins
 * for the plies a real circuit would take — the number of them is what the guard reads.
 */

it("is no repetition in a position the game has never stood in", () => {
  expect(isRepetition(having(elsewhere(8)))).toBe(false);
});

it("is no repetition the second time a position stands", () => {
  const state = having(elsewhere(8));

  expect(isRepetition(withStandingCounted(state, 1))).toBe(false);
});

it("is a repetition the third time a position stands", () => {
  const state = having(elsewhere(8));

  expect(isRepetition(withStandingCounted(state, 2))).toBe(true);
});

it("is a repetition still, past a third standing", () => {
  const state = having(elsewhere(8));

  expect(isRepetition(withStandingCounted(state, 3))).toBe(true);
});

/**
 * A position cannot come round in fewer than four plies and a third standing needs two circuits, so
 * there is nothing to find below eight and the standing is never built. Guarding on the count is
 * what keeps an opening from paying for a question it cannot answer yes to.
 */
it("does not look at all before a third standing could possibly have happened", () => {
  const state = having(elsewhere(5));

  expect(isRepetition(withStandingCounted(state, 2))).toBe(false);
});

it("counts only its own standing, not how much the game has left behind", () => {
  expect(isRepetition(having(elsewhere(10)))).toBe(false);
});

/** The game as it stands, with `count` earlier standings of it among what it has left behind. */
function withStandingCounted(state: GameState, count: number): GameState {
  return {...state, seen: [...state.seen, ...Array<Standing>(count).fill(standingOf(state))]};
}

function having(seen: readonly Standing[]): GameState {
  return {...position(), seen};
}

/**
 * Standings of positions this game is not in, only there to be counted by the guard. Real ones,
 * built by walking a chariot up a file — a `Standing` cannot be conjured out of an arbitrary string,
 * and a made-up one would not be the thing the guard is counting.
 */
function elsewhere(count: number): readonly Standing[] {
  return RANKS.slice(0, count).map(rank => standingOf(position(cho("chariot", 1, rank))));
}

function position(...alsoStanding: readonly PlacedPiece[]): GameState {
  return {
    pieces: [cho("general", 5, 9), han("general", 4, 2), ...alsoStanding],
    sideToMove: "cho",
    format: "Casual",
    consecutivePasses: 0,
    seen: [],
    reachedByAGeneralCapture: false,
    bikjangCalled: false,
  };
}

function cho(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "cho", type, file, rank});
}

function han(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "han", type, file, rank});
}

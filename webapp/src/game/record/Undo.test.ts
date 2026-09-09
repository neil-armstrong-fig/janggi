import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {expect, it} from "vitest";
import {outcomeOf} from "@src/game/OutcomeOf";
import {undo} from "@src/game/record/Undo";

it("stands the game back on the position it was last played from", () => {
  const before = board();

  expect(undo(record([before], reached(), [])).present).toBe(before);
});

it("takes that position off the ones played", () => {
  const earlier = board();

  expect(undo(record([earlier, reached()], reached(), [])).past).toEqual([earlier]);
});

it("sets the position it left aside to be played again", () => {
  const left = reached();

  expect(undo(record([board()], left, [])).future).toEqual([left]);
});

it("sets it in front of anything already taken back, so the nearest comes first", () => {
  const takenBackEarlier = board();
  const left = reached();

  expect(undo(record([board()], left, [takenBackEarlier])).future).toEqual([left, takenBackEarlier]);
});

/** One ply, so two of them walk back two — there is no round for it to step over. */
it("takes the game back one position at a time", () => {
  const first = board();
  const second = reached();

  expect(undo(undo(record([first, second], reached(), []))).present).toBe(first);
});

/**
 * The whole reason undo does not ask `outcomeOf` the way `applyMove` and `pass` both do. Taking back
 * the turn that ended the game is the ordinary use, not an edge of it.
 */
it("takes back the rested turn that settled the game on points", () => {
  const stillPlaying = toMove("han", 1, cho("general", 5, 9), han("general", 5, 2));
  const settled = toMove("cho", 2, cho("general", 5, 9), han("general", 5, 2));

  const takenBack = undo(record([stillPlaying], settled, []));

  expect(outcomeOf(settled).kind).toBe("pointsWin");
  expect(outcomeOf(takenBack.present)).toEqual({kind: "undecided"});
});

it("leaves the record it was handed untouched", () => {
  const played = record([board()], reached(), []);

  undo(played);

  expect(played.past).toHaveLength(1);
  expect(played.future).toEqual([]);
});

it("refuses when the game has not been played from", () => {
  expect(() => undo(record([], board(), []))).toThrow("nothing to take back");
});

function record(past: readonly GameState[], present: GameState, future: readonly GameState[]): PlayedGame {
  return {past, present, future};
}

function board(): GameState {
  return toMove("cho", 0, cho("general", 5, 9), han("general", 5, 2));
}

function reached(): GameState {
  return toMove("han", 0, cho("general", 5, 8), han("general", 5, 2));
}

function toMove(sideToMove: Side, consecutivePasses: number, ...pieces: readonly PlacedPiece[]): GameState {
  return {pieces, sideToMove, consecutivePasses};
}

function cho(type: PieceType, file: number, rank: number): PlacedPiece {
  return placed("cho", type, file, rank);
}

function han(type: PieceType, file: number, rank: number): PlacedPiece {
  return placed("han", type, file, rank);
}

function placed(side: Side, type: PieceType, file: number, rank: number): PlacedPiece {
  return {piece: {side, type}, position: {file, rank} as PlacedPiece["position"]};
}

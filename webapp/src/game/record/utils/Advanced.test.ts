import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {advanced} from "@src/game/record/utils/Advanced";
import {expect, it} from "vitest";

it("stands the new position as the one being played", () => {
  const reached = toMove("han", 0, cho("general", 5, 8), han("general", 5, 2));

  expect(advanced(record([], opening(), []), reached).present).toBe(reached);
});

it("keeps the position it replaced, as the newest thing played", () => {
  const started = opening();
  const reached = toMove("han", 0, cho("general", 5, 8), han("general", 5, 2));

  expect(advanced(record([], started, []), reached).past).toEqual([started]);
});

it("adds to what was already played rather than replacing it", () => {
  const earlier = opening();
  const started = toMove("han", 0, cho("general", 5, 8), han("general", 5, 2));
  const reached = toMove("cho", 0, cho("general", 5, 8), han("general", 5, 3));

  expect(advanced(record([earlier], started, []), reached).past).toEqual([earlier, started]);
});

/** Play on and the branch undo set aside is stale — offering it back would be a move from a game
 * nobody is in any more. */
it("forgets whatever had been taken back", () => {
  const abandoned = toMove("han", 0, cho("general", 4, 9), han("general", 5, 2));
  const reached = toMove("han", 0, cho("general", 5, 8), han("general", 5, 2));

  expect(advanced(record([], opening(), [abandoned]), reached).future).toEqual([]);
});

it("leaves the record it was handed untouched", () => {
  const played = record([], opening(), []);

  advanced(played, toMove("han", 0, cho("general", 5, 8), han("general", 5, 2)));

  expect(played.past).toEqual([]);
});

function record(past: readonly GameState[], present: GameState, future: readonly GameState[]): PlayedGame {
  return {past, present, future};
}

function opening(): GameState {
  return toMove("cho", 0, cho("general", 5, 9), han("general", 5, 2));
}

function toMove(sideToMove: Side, consecutivePasses: number, ...pieces: readonly PlacedPiece[]): GameState {
  return {
    pieces,
    sideToMove,
    format: "Casual",
    consecutivePasses,
    seen: [],
    reachedByAGeneralCapture: false,
    bikjangCalled: false,
  };
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

import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {expect, it} from "vitest";
import {threatIn} from "@src/react/pages/game/components/board/utils/ThreatIn";

it("names the general of the army to move, and the piece giving it check", () => {
  const game = position("cho", cho("general", 5, 9), han("chariot", 5, 1), han("general", 4, 2));

  expect(threatIn(game)).toEqual({general: {file: 5, rank: 9}, attackers: [{file: 5, rank: 1}]});
});

it("names every piece of a double check", () => {
  const game = position("cho", cho("general", 5, 9), han("chariot", 5, 1), han("horse", 4, 7), han("general", 4, 2));

  expect(threatIn(game)?.attackers).toHaveLength(2);
});

it("has nothing to say where the army to move is not in check", () => {
  expect(threatIn(position("cho", cho("general", 5, 9), han("chariot", 1, 1), han("general", 4, 2)))).toBeUndefined();
});

/** Only the army to move is asked about — the other army's general is never the one in check. */
it("does not name the general of the army that is not to move", () => {
  const game = position("cho", cho("general", 5, 9), cho("chariot", 4, 10), han("general", 4, 2));

  expect(threatIn(game)).toBeUndefined();
});

function position(sideToMove: Side, ...pieces: readonly PlacedPiece[]): GameState {
  return {
    pieces,
    sideToMove,
    format: "Casual",
    consecutivePasses: 0,
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

import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {expect, it} from "vitest";
import {isCheckmate} from "@src/game/IsCheckmate";
import {legalMovesFor} from "@src/game/LegalMovesFor";

/**
 * Cho's palace is files 4-6, ranks 8-10, with its general on the centre at (5,9). Mating it means
 * covering all nine of those points, which three chariots on files 4, 5 and 6 do between them.
 */

it("is mate when the general is in check and nothing answers it", () => {
  const state = choToMove(
    cho("general", 5, 9),
    han("general", 5, 2),
    han("chariot", 4, 1),
    han("chariot", 6, 1),
    han("chariot", 5, 3),
  );

  expect(isCheckmate(state, "cho")).toBe(true);
});

it("is not mate while the general still has somewhere to go", () => {
  const state = choToMove(cho("general", 5, 9), han("general", 5, 2), han("chariot", 5, 3));

  expect(isCheckmate(state, "cho")).toBe(false);
});

it("is not mate when the checking piece can be taken", () => {
  const state = choToMove(
    cho("general", 5, 9),
    cho("chariot", 1, 3),
    han("general", 4, 2),
    han("chariot", 5, 3),
    han("chariot", 4, 1),
    han("chariot", 6, 1),
  );

  expect(isCheckmate(state, "cho")).toBe(false);
});

/**
 * Janggi has no stalemate: a player with nothing to play passes, so having no move is only fatal
 * while already in check. Here every point around the general is covered but the general itself is
 * not attacked — nothing to do, and not a loss. See `docs/rules.md` §6.3.
 */
it("is not mate with no legal move but no check", () => {
  const boxedIn = choToMove(
    cho("general", 5, 9),
    han("general", 5, 2),
    han("chariot", 4, 1),
    han("chariot", 6, 1),
    han("chariot", 1, 8),
    han("chariot", 1, 10),
  );

  expect(legalMovesFor(boxedIn)).toEqual([]);
  expect(isCheckmate(boxedIn, "cho")).toBe(false);
});

/** An army with a move coming cannot already have been mated. */
it("is not mate on the other army's turn", () => {
  const hanToMove: GameState = {
    ...choToMove(
      cho("general", 5, 9),
      han("general", 5, 2),
      han("chariot", 4, 1),
      han("chariot", 6, 1),
      han("chariot", 5, 3),
    ),
    sideToMove: "han",
  };

  expect(isCheckmate(hanToMove, "cho")).toBe(false);
});

function choToMove(...pieces: readonly PlacedPiece[]): GameState {
  return {pieces, sideToMove: "cho"};
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

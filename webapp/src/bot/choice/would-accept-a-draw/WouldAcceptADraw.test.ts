import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {DEFAULT_SETUP} from "@src/game/setups/Setups";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";
import {placed} from "@src/testing/Placed";
import {wouldAcceptADraw} from "@src/bot/choice/would-accept-a-draw/WouldAcceptADraw";

it("accepts a draw in an endgame it is not winning", () => {
  expect(wouldAcceptADraw(endgame("Casual"), 0)).toBe(true);
});

it("accepts a draw in an endgame it is losing", () => {
  expect(wouldAcceptADraw(endgame("Casual"), -400)).toBe(true);
});

it("declines a draw in an endgame it is clearly winning", () => {
  expect(wouldAcceptADraw(endgame("Casual"), 300)).toBe(false);
});

/** A soldier's worth of edge is not clearly winning, so the margin is where the bot turns a draw down. */
it("still accepts a draw at the margin, a level game with a shade in its favour", () => {
  expect(wouldAcceptADraw(endgame("Casual"), 100)).toBe(true);
});

it("declines a draw when it has no evaluation to go on", () => {
  expect(wouldAcceptADraw(endgame("Casual"), undefined)).toBe(false);
});

/**
 * A draw offered at the first move is one that could be had over and over for the rating a draw with
 * a stronger bot earns, so it is only worth taking where the game has nothing left to play for — the
 * same thirty points a side that lets a position be repeated at all.
 */
it("declines a draw while either army still holds thirty points or more", () => {
  const opening = newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual");

  expect(wouldAcceptADraw(opening, -400)).toBe(false);
});

it("declines a draw in a scored game, which has none to accept", () => {
  expect(wouldAcceptADraw(endgame("Scored"), 0)).toBe(false);
});

function endgame(format: MatchFormat): GameState {
  return {
    pieces: [cho("general", 5, 9), cho("chariot", 1, 8), han("general", 4, 2), han("chariot", 9, 3)],
    sideToMove: "cho",
    format,
    consecutivePasses: 0,
    seen: [],
    reachedByAGeneralCapture: false,
    bikjangCalled: false,
    drawAgreed: false,
  };
}

function cho(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "cho", type, file, rank});
}

function han(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "han", type, file, rank});
}

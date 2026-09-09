import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {expect, it} from "vitest";
import {gameStatusOf} from "@src/react/pages/game/components/turn-indicator/utils/GameStatusOf";
import {newGame} from "@src/game/NewGame";

it("says whose move it is when nothing is hanging over them", () => {
  expect(gameStatusOf(opening())).toEqual({kind: "toMove", side: "cho"});
});

it("says an army is in check when its general is under attack", () => {
  const state = position("han", han("general", 4, 2), cho("general", 5, 9), cho("chariot", 4, 9));

  expect(gameStatusOf(state)).toEqual({kind: "inCheck", side: "han"});
});

/**
 * The case no acceptance test can reach: a mate is far deeper than anyone can tap out, so this is
 * the only cover for what the app says at the end of a game.
 */
it("says the other army has won when the one to move is mated", () => {
  const mated = position(
    "cho",
    cho("general", 5, 9),
    han("general", 5, 2),
    han("chariot", 4, 1),
    han("chariot", 6, 1),
    han("chariot", 5, 3),
  );

  expect(gameStatusOf(mated)).toEqual({kind: "won", by: "han"});
});

/** A mate is a check as well, so asking in the wrong order would report a game still in play. */
it("prefers the win to the check, a mate being both", () => {
  const mated = position(
    "cho",
    cho("general", 5, 9),
    han("general", 5, 2),
    han("chariot", 4, 1),
    han("chariot", 6, 1),
    han("chariot", 5, 3),
  );

  expect(gameStatusOf(mated).kind).not.toBe("inCheck");
});

/** Both players rested a turn, so the game stopped and the score settled it — han's 덤 here. */
it("says who won on points once both armies have rested a turn", () => {
  const stopped = stoppedGame(cho("general", 5, 9), cho("chariot", 1, 10), han("general", 5, 2), han("chariot", 1, 1));

  expect(gameStatusOf(stopped)).toEqual({kind: "wonOnPoints", by: "han"});
});

it("still says whose move it is after only one rested turn", () => {
  expect(gameStatusOf({...opening(), consecutivePasses: 1})).toEqual({kind: "toMove", side: "cho"});
});

/**
 * The one drawn ending janggi has, and only in a casual game — a scored one settles the same call on
 * points. This is where the two are told apart, since neither is reachable through the turn line.
 */
it("is drawn once a bikjang has been called in a casual game", () => {
  const called = {...position("cho", cho("general", 5, 9), han("general", 5, 2)), bikjangCalled: true};

  expect(gameStatusOf(called)).toEqual({kind: "drawn"});
});

it("is won on points by the same call in a scored game, there being no draw to reach", () => {
  const bare = position("cho", cho("general", 5, 9), han("general", 5, 2));
  const called: GameState = {...bare, format: "Scored", bikjangCalled: true};

  expect(gameStatusOf(called)).toEqual({kind: "wonOnPoints", by: "han"});
});

/** A bikjang standing on the board decides nothing until somebody calls it. */
it("is still someone's move while a bikjang stands uncalled", () => {
  const facing = position("cho", cho("general", 5, 9), han("general", 5, 2));

  expect(gameStatusOf(facing)).toEqual({kind: "toMove", side: "cho"});
});

function opening(): GameState {
  return newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
}

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

function stoppedGame(...pieces: readonly PlacedPiece[]): GameState {
  return {...position("cho", ...pieces), consecutivePasses: 2};
}

function cho(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return {piece: {side: "cho", type}, position: {file, rank}};
}

function han(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return {piece: {side: "han", type}, position: {file, rank}};
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

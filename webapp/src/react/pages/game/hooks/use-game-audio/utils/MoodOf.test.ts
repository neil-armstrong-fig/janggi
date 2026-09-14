import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {expect, it} from "vitest";
import {moodOf} from "@src/react/pages/game/hooks/use-game-audio/utils/MoodOf";
import {newGame} from "@src/game/NewGame";

it("is calm at the opening", () => {
  expect(moodOf(opening())).toEqual({tension: 0, inCheck: false, ending: "none"});
});

it("grows tenser as material comes off the board, and never eases while it does", () => {
  const tensions = [0, 2, 4, 6, 8, 10, 12].map(lifted => moodOf(withoutNonGenerals(opening(), lifted)).tension);

  tensions.slice(1).forEach((tension, index) => {
    expect(tension).toBeGreaterThanOrEqual(tensions[index] ?? 0);
  });
  expect(tensions.at(-1)).toBeGreaterThan(tensions[0] ?? 0);
});

/** The last captures of a game are already its most fraught; the music must not still be climbing there. */
it("is as tense as it gets well before the board is empty", () => {
  const thinned = withoutNonGenerals(opening(), 22);

  expect(moodOf(thinned).tension).toBe(1);
  expect(thinned.pieces.length).toBeGreaterThan(2);
});

it("hears the army to move in check", () => {
  expect(moodOf(check()).inCheck).toBe(true);
});

it("hears a checkmate as a game won, and no longer as a check", () => {
  expect(moodOf(mate())).toMatchObject({inCheck: false, ending: "won"});
});

it("hears a casual bikjang as a draw", () => {
  const drawn: GameState = {...position(cho("general", 5, 9), han("general", 5, 2)), bikjangCalled: true};

  expect(moodOf(drawn).ending).toBe("drawn");
});

function opening(): GameState {
  return newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
}

/**
 * The game with that many pieces lifted off, the generals always kept. Which army they come from does
 * not matter here — tension is measured on what both armies have lost together.
 */
function withoutNonGenerals(game: GameState, count: number): GameState {
  const lifted = new Set(game.pieces.filter(({piece}) => piece.type !== "general").slice(0, count));

  return {...game, pieces: game.pieces.filter(placed => !lifted.has(placed))};
}

/** Cho to move, its general attacked down file 5, with somewhere to step out to. */
function check(): GameState {
  return position(cho("general", 5, 9), han("chariot", 5, 5), han("general", 4, 2));
}

/** Cho mated on (5,10): the three points it could step to are each covered by one of Han's chariots. */
function mate(): GameState {
  return position(
    cho("general", 5, 10),
    han("chariot", 4, 5),
    han("chariot", 5, 5),
    han("chariot", 6, 5),
    han("general", 5, 2),
  );
}

function position(...pieces: readonly PlacedPiece[]): GameState {
  return {
    pieces,
    sideToMove: "cho",
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

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

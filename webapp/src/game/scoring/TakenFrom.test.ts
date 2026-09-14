import type {GameState} from "@src/game/types/GameState";
import {PIECE_TYPES} from "@janggi/shared/janggi/pieces/PieceType";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";
import {takenFrom} from "@src/game/scoring/TakenFrom";

/**
 * Losses are made by lifting pieces off a real opening rather than by building a sparse board, since
 * a board with only a handful of pieces on it has "lost" most of an army and would say nothing about
 * the one piece a test means.
 */

/**
 * This is what keeps `DEALT` honest, and it has to look both ways. A fresh deal having lost nothing
 * catches an army counted too large; an emptied board having lost exactly what the setup dealt
 * catches one counted too small — which a full board never could, `takenFrom` flooring at nothing.
 */
it("counts the army every setup deals: none of it lost from a fresh board, all of it from an empty one", () => {
  for (const setup of SETUPS) {
    const game = newGame(setup, setup, "Casual");
    const dealt = game.pieces.filter(({piece}) => piece.side === "han").map(({piece}) => piece.type);

    expect({setup: setup.name, taken: takenFrom(game, "han")}).toEqual({setup: setup.name, taken: []});
    expect({setup: setup.name, taken: takenFrom({...game, pieces: []}, "han")}).toEqual({
      setup: setup.name,
      taken: [...dealt].sort(byPieceOrder),
    });
  }
});

it("names a piece that has gone from the board", () => {
  const game = without(opening(), "han", "chariot");

  expect(takenFrom(game, "han")).toEqual(["chariot"]);
});

it("counts only the army it was asked about", () => {
  const game = without(opening(), "han", "chariot");

  expect(takenFrom(game, "cho")).toEqual([]);
});

it("names a piece once for each of that kind taken", () => {
  const game = without(without(opening(), "cho", "soldier"), "cho", "soldier");

  expect(takenFrom(game, "cho")).toEqual(["soldier", "soldier"]);
});

it("lists what was taken in the order pieces are named, whatever order it went in", () => {
  const game = without(without(opening(), "cho", "soldier"), "cho", "chariot");

  expect(takenFrom(game, "cho")).toEqual(["chariot", "soldier"]);
});

function opening(): GameState {
  return newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
}

/** The game with one piece of that kind lifted off — whichever of them was dealt first. */
function without(game: GameState, side: Side, type: PieceType): GameState {
  const lifted = game.pieces.find(({piece}) => piece.side === side && piece.type === type);

  return {...game, pieces: game.pieces.filter(placed => placed !== lifted)};
}

function byPieceOrder(one: PieceType, other: PieceType): number {
  return PIECE_TYPES.indexOf(one) - PIECE_TYPES.indexOf(other);
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

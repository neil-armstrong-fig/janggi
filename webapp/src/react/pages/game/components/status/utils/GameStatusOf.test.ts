import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {expect, it} from "vitest";
import {gameStatusOf} from "@src/react/pages/game/components/status/utils/GameStatusOf";
import {newGame} from "@src/game/NewGame";
import {place} from "@src/game/setups/Place";
import {setupPhaseFor} from "@src/game/setups/SetupPhaseFor";
import {stoodBefore} from "@src/testing/StoodBefore";

it("says whose move it is when nothing is hanging over them", () => {
  expect(gameStatusOf(opening(), LAID_OUT)).toEqual({kind: "toMove", side: "cho"});
});

it("says an army is in check when its general is under attack", () => {
  const state = position("han", han("general", 4, 2), cho("general", 5, 9), cho("chariot", 4, 9));

  expect(gameStatusOf(state, LAID_OUT)).toEqual({kind: "inCheck", side: "han"});
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

  expect(gameStatusOf(mated, LAID_OUT)).toEqual({kind: "won", by: "han"});
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

  expect(gameStatusOf(mated, LAID_OUT).kind).not.toBe("inCheck");
});

/** Both players rested a turn, so the game stopped and the score settled it — han's 덤 here. */
it("says who won on points once both armies have rested a turn", () => {
  const stopped = stoppedGame(cho("general", 5, 9), cho("chariot", 1, 10), han("general", 5, 2), han("chariot", 1, 1));

  expect(gameStatusOf(stopped, LAID_OUT)).toEqual({kind: "wonOnPoints", by: "han"});
});

it("still says whose move it is after only one rested turn", () => {
  expect(gameStatusOf({...opening(), consecutivePasses: 1}, LAID_OUT)).toEqual({kind: "toMove", side: "cho"});
});

/**
 * The one drawn ending janggi has, and only in a casual game — a scored one settles the same call on
 * points. This is where the two are told apart, since neither is reachable through the turn line.
 */
it("is drawn once a bikjang has been called in a casual game", () => {
  const called = {...position("cho", cho("general", 5, 9), han("general", 5, 2)), bikjangCalled: true};

  expect(gameStatusOf(called, LAID_OUT)).toEqual({kind: "drawn", by: "bikjang"});
});

/**
 * The two endings a player can only reach by tapping to under thirty points a side, or by an agreement
 * the acceptance spec plays from the opening: this is where each is told apart from the call.
 */
it("is drawn by agreement once a draw has been agreed", () => {
  const agreed = {...position("cho", cho("general", 5, 9), han("general", 4, 2)), drawAgreed: true};

  expect(gameStatusOf(agreed, LAID_OUT)).toEqual({kind: "drawn", by: "agreement"});
});

it("is drawn by repetition once a casual game stands a third time in a position nothing refuses", () => {
  const repeated = stoodBefore(position("cho", cho("general", 5, 9), han("general", 4, 2)), 2);

  expect(gameStatusOf(repeated, LAID_OUT)).toEqual({kind: "drawn", by: "repetition"});
});

it("is won on points by the same repetition in a scored game, there being no draw to reach", () => {
  const bare = position("cho", cho("general", 5, 9), han("general", 4, 2));

  expect(gameStatusOf(stoodBefore({...bare, format: "Scored"}, 2), LAID_OUT)).toEqual({
    kind: "wonOnPoints",
    by: "han",
  });
});

it("is won on points by the same call in a scored game, there being no draw to reach", () => {
  const bare = position("cho", cho("general", 5, 9), han("general", 5, 2));
  const called: GameState = {...bare, format: "Scored", bikjangCalled: true};

  expect(gameStatusOf(called, LAID_OUT)).toEqual({kind: "wonOnPoints", by: "han"});
});

/** A bikjang standing on the board decides nothing until somebody calls it. */
it("is still someone's move while a bikjang stands uncalled", () => {
  const facing = position("cho", cho("general", 5, 9), han("general", 5, 2));

  expect(gameStatusOf(facing, LAID_OUT)).toEqual({kind: "toMove", side: "cho"});
});

/**
 * The board a scored game is laid out on, at each of the three points it passes through. What is
 * drawn on it is beside the point — until both armies have chosen there is no game there, and the
 * phase outranks anything the position has to say.
 */
it("says an army is still to lay out before it has", () => {
  expect(gameStatusOf(opening(), setupPhaseFor("Scored"))).toEqual({kind: "layingOut", side: "han"});
});

it("waits on cho once han has laid out, han arranging first", () => {
  const hanHasChosen = place(setupPhaseFor("Scored"), "han", setup("Left Elephant"));

  expect(gameStatusOf(opening(), hanHasChosen)).toEqual({kind: "layingOut", side: "cho"});
});

/** The phase is asked first, so a mate on a board nobody arranged is still nobody's win. */
it("says nothing about the position while the board is still being laid out", () => {
  const stopped: GameState = {...opening(), consecutivePasses: 2};

  expect(gameStatusOf(stopped, setupPhaseFor("Scored"))).toEqual({kind: "layingOut", side: "han"});
});

function opening(): GameState {
  return newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
}

/**
 * A phase both armies have finished with, which is every case above bar the three laying-out ones.
 * A casual game is never in any other state.
 */
const LAID_OUT = place(place(setupPhaseFor("Casual"), "han", setup("Inner Elephant")), "cho", setup("Inner Elephant"));

function position(sideToMove: Side, ...pieces: readonly PlacedPiece[]): GameState {
  return {
    pieces,
    sideToMove,
    format: "Casual",
    consecutivePasses: 0,
    seen: [],
    reachedByAGeneralCapture: false,
    bikjangCalled: false,
    drawAgreed: false,
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

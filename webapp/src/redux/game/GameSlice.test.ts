import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {Move} from "@src/game/types/Move";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {expect, it} from "vitest";
import {choSetupChosen, gameReducer, moved, passed, restarted} from "@src/redux/game/GameSlice";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";

/**
 * The reducers are one line each into the engine, which is where the rules are tested. What is
 * worth testing here is the wiring: that the move actually reaches `applyMove`, that its result
 * replaces the slice rather than being dropped, and that the turn it hands back is the one the app
 * then plays on. Nothing in a game reaches the second player without this.
 */

const CHO_OPENING: Move = {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}};

it("plays the move onto the game", () => {
  const after = gameReducer(opening(), moved(CHO_OPENING));

  expect(pieceOn(after, 1, 6)).toEqual({side: "cho", type: "soldier"});
  expect(pieceOn(after, 1, 7)).toBeUndefined();
});

it("hands the turn to the other army", () => {
  expect(opening().game.sideToMove).toBe("cho");
  expect(gameReducer(opening(), moved(CHO_OPENING)).game.sideToMove).toBe("han");
});

it("counts the move", () => {
  expect(gameReducer(opening(), moved(CHO_OPENING)).turnsTaken).toBe(1);
});

it("rests the turn on the game, handing the move over without touching the board", () => {
  const after = gameReducer(opening(), passed());

  expect(after.game.sideToMove).toBe("han");
  expect(after.game.pieces).toEqual(opening().game.pieces);
});

/** A pass is not a move, but it is a turn — and a back rank is arranged strictly before play. */
it("counts a rested turn too, so the setups lock behind it", () => {
  expect(gameReducer(opening(), passed()).turnsTaken).toBe(1);
});

/** `applyMove` throws rather than returning undefined, and the reducer must not swallow that — a
 * move the rules refuse is a bug at the call site, not a turn quietly skipped. */
it("refuses a move by the army whose turn it is not", () => {
  const hanOnChosTurn: Move = {from: {file: 1, rank: 4}, to: {file: 1, rank: 5}};

  expect(() => gameReducer(opening(), moved(hanOnChosTurn))).toThrow(/cho to move/);
});

it("leaves the setups alone when a move is played", () => {
  const after = gameReducer(opening(), moved(CHO_OPENING));

  expect(after.hanSetup).toBe(opening().hanSetup);
  expect(after.choSetup).toBe(opening().choSetup);
});

it("deals a fresh game when one is restarted, giving the first move back to cho", () => {
  const played = gameReducer(opening(), moved(CHO_OPENING));

  const after = gameReducer(played, restarted());

  expect(after.game.pieces).toHaveLength(32);
  expect(after.game.sideToMove).toBe("cho");
  expect(after.turnsTaken).toBe(0);
});

/**
 * A setup is dealt, not applied, so choosing one starts the game over. That is correct — and it is
 * also why the pickers have to be locked once play begins, which they are not yet. See
 * `types/GameSliceState.ts`.
 */
it("deals a fresh game when either army's setup is chosen", () => {
  const played = gameReducer(opening(), moved(CHO_OPENING));

  const after = gameReducer(played, choSetupChosen(setup("Outer Elephant")));

  expect(after.choSetup.name).toBe("Outer Elephant");
  expect(after.game.sideToMove).toBe("cho");
  expect(after.turnsTaken).toBe(0);
  expect(pieceOn(after, 1, 7)).toEqual({side: "cho", type: "soldier"});
});

function opening(): GameSliceState {
  return gameReducer(undefined, {type: "@@INIT"});
}

function pieceOn(state: GameSliceState, file: number, rank: number): Piece | undefined {
  return state.game.pieces.find(({position}) => position.file === file && position.rank === rank)?.piece;
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

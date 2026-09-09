import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {Move} from "@src/game/types/Move";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {expect, it} from "vitest";
import {
  bikjangCalled,
  choSetupChosen,
  formatChosen,
  gameReducer,
  moved,
  passed,
  playedAgain,
  restarted,
  takenBack,
} from "@src/redux/game/GameSlice";
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
  expect(opening().played.present.sideToMove).toBe("cho");
  expect(gameReducer(opening(), moved(CHO_OPENING)).played.present.sideToMove).toBe("han");
});

it("keeps the position the move was played from, so it can be taken back", () => {
  expect(gameReducer(opening(), moved(CHO_OPENING)).played.past).toEqual([opening().played.present]);
});

it("rests the turn on the game, handing the move over without touching the board", () => {
  const after = gameReducer(opening(), passed());

  expect(after.played.present.sideToMove).toBe("han");
  expect(after.played.present.pieces).toEqual(opening().played.present.pieces);
});

/** A pass is not a move, but it is a turn — and a back rank is arranged strictly before play. */
it("records a rested turn too, so the setups lock behind it", () => {
  expect(gameReducer(opening(), passed()).played.past).toHaveLength(1);
});

it("takes the last turn back", () => {
  const played = gameReducer(opening(), moved(CHO_OPENING));

  const after = gameReducer(played, takenBack());

  expect(after.played.present).toEqual(opening().played.present);
  expect(after.played.past).toEqual([]);
});

it("plays a turn that was taken back again", () => {
  const played = gameReducer(opening(), moved(CHO_OPENING));
  const back = gameReducer(played, takenBack());

  const after = gameReducer(back, playedAgain());

  expect(after.played).toEqual(played.played);
});

/**
 * `undo` throws rather than returning undefined, exactly as `applyMove` does, and the reducer must
 * not swallow it. The control is disabled off `canUndo`, which is what stops it being dispatched.
 */
it("refuses to take back a game nobody has played", () => {
  expect(() => gameReducer(opening(), takenBack())).toThrow(/nothing to take back/);
});

it("refuses to play again when nothing has been taken back", () => {
  expect(() => gameReducer(opening(), playedAgain())).toThrow(/nothing to play again/);
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

  expect(after.played.present.pieces).toHaveLength(32);
  expect(after.played.present.sideToMove).toBe("cho");
  expect(after.played.past).toEqual([]);
});

/**
 * A setup is dealt, not applied, so choosing one starts the game over. That is correct — and it is
 * why the pickers are locked once play begins, and open again once it has all been taken back. See
 * `types/GameSliceState.ts`.
 */
it("deals a fresh game when either army's setup is chosen", () => {
  const played = gameReducer(opening(), moved(CHO_OPENING));

  const after = gameReducer(played, choSetupChosen(setup("Outer Elephant")));

  expect(after.choSetup.name).toBe("Outer Elephant");
  expect(after.played.present.sideToMove).toBe("cho");
  expect(after.played.past).toEqual([]);
  expect(pieceOn(after, 1, 7)).toEqual({side: "cho", type: "soldier"});
});

/**
 * A bikjang cannot be called from the opening — the two soldiers on file 5 stand between the
 * generals — so the wiring is checked by the throw coming through rather than being swallowed. The
 * control is disabled off `canCallBikjang`, which is what stops it being dispatched. That a real
 * bikjang can be reached and called is `CallingABikjang.test.ts`'s job.
 */
it("refuses a call when the generals are not facing each other", () => {
  expect(() => gameReducer(opening(), bikjangCalled())).toThrow(/not facing each other/);
});

/** A format is dealt, not applied, exactly as a setup is — so choosing one starts the game over. */
it("deals a fresh game in the chosen format", () => {
  const played = gameReducer(opening(), moved(CHO_OPENING));

  const after = gameReducer(played, formatChosen("Scored"));

  expect(after.format).toBe("Scored");
  expect(after.played.present.format).toBe("Scored");
  expect(after.played.present.sideToMove).toBe("cho");
  expect(after.played.past).toEqual([]);
});

it("keeps the format when a game is restarted or a setup is chosen", () => {
  const scored = gameReducer(opening(), formatChosen("Scored"));

  expect(gameReducer(scored, restarted()).format).toBe("Scored");
  expect(gameReducer(scored, choSetupChosen(setup("Outer Elephant"))).format).toBe("Scored");
});

function opening(): GameSliceState {
  return gameReducer(undefined, {type: "@@INIT"});
}

function pieceOn(state: GameSliceState, file: number, rank: number): Piece | undefined {
  return state.played.present.pieces.find(({position}) => position.file === file && position.rank === rank)?.piece;
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

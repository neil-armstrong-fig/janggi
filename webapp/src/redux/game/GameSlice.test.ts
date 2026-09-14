import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {Move} from "@src/game/types/Move";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {expect, it} from "vitest";
import {
  bikjangCalled,
  botStrengthChosen,
  choSetupChosen,
  formatChosen,
  gameReducer,
  hanSetupChosen,
  moved,
  opponentChosen,
  passed,
  playedAgain,
  restarted,
  sideChosen,
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

it("deals a game against someone at the same device, with the bot's settings at their defaults", () => {
  expect(opening().opponent).toEqual({name: "Human", botElo: 1200, sideChoice: "Cho", playerSide: "cho"});
});

it("deals a fresh game when the bot is chosen as the opponent", () => {
  const played = gameReducer(opening(), moved(CHO_OPENING));

  const after = gameReducer(played, opponentChosen("Bot"));

  expect(after.opponent.name).toBe("Bot");
  expect(after.played.past).toEqual([]);
});

it("deals a fresh game at the bot strength chosen", () => {
  const played = gameReducer(gameReducer(opening(), opponentChosen("Bot")), moved(CHO_OPENING));

  const after = gameReducer(played, botStrengthChosen(1600));

  expect(after.opponent.botElo).toBe(1600);
  expect(after.played.past).toEqual([]);
});

it("puts the player on the army they choose", () => {
  const after = gameReducer(opening(), sideChosen("Han"));

  expect(after.opponent).toMatchObject({sideChoice: "Han", playerSide: "han"});
});

it("settles a random side into one of the two armies", () => {
  const after = gameReducer(opening(), sideChosen("Random"));

  expect(after.opponent.sideChoice).toBe("Random");
  expect(["cho", "han"]).toContain(after.opponent.playerSide);
});

it("settles a random side as it was rolled when the choice was made", () => {
  const after = gameReducer(opening(), {type: sideChosen.type, payload: {choice: "Random", side: "han"}});

  expect(after.opponent.playerSide).toBe("han");
});

it("rolls a random side again when the game is restarted", () => {
  const random = gameReducer(opening(), {type: sideChosen.type, payload: {choice: "Random", side: "han"}});

  expect(gameReducer(random, {type: restarted.type, payload: "cho"}).opponent.playerSide).toBe("cho");
});

it("keeps a chosen side when the game is restarted, whatever the roll", () => {
  const han = gameReducer(opening(), sideChosen("Han"));

  expect(gameReducer(han, {type: restarted.type, payload: "cho"}).opponent.playerSide).toBe("han");
});

it("keeps the opponent when the format or a setup is chosen, or the game restarted", () => {
  const bot = gameReducer(gameReducer(opening(), opponentChosen("Bot")), botStrengthChosen(800));

  expect(gameReducer(bot, formatChosen("Scored")).opponent).toEqual(bot.opponent);
  expect(gameReducer(bot, choSetupChosen(setup("Outer Elephant"))).opponent).toEqual(bot.opponent);
  expect(gameReducer(bot, restarted()).opponent).toEqual(bot.opponent);
});

it("deals a scored game against the bot with nobody laid out, whichever side the player takes", () => {
  const scored = gameReducer(gameReducer(opening(), formatChosen("Scored")), opponentChosen("Bot"));
  const hanHasLaidOut = gameReducer(scored, hanSetupChosen(setup("Left Elephant")));

  const after = gameReducer(hanHasLaidOut, sideChosen("Han"));

  expect(after.phase.hanSetup).toBeUndefined();
  expect(after.phase.choSetup).toBeUndefined();
});

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

  expect(after.phase.hanSetup).toBe(opening().phase.hanSetup);
  expect(after.phase.choSetup).toBe(opening().phase.choSetup);
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

  expect(after.phase.choSetup?.name).toBe("Outer Elephant");
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

  expect(after.phase.format).toBe("Scored");
  expect(after.played.present.format).toBe("Scored");
  expect(after.played.present.sideToMove).toBe("cho");
  expect(after.played.past).toEqual([]);
});

it("keeps the format when a game is restarted or a setup is chosen", () => {
  const scored = gameReducer(opening(), formatChosen("Scored"));
  const hanHasLaidOut = gameReducer(scored, hanSetupChosen(setup("Left Elephant")));

  expect(gameReducer(scored, restarted()).phase.format).toBe("Scored");
  expect(gameReducer(hanHasLaidOut, choSetupChosen(setup("Outer Elephant"))).phase.format).toBe("Scored");
});

/**
 * Choosing the scored format hands the board back to its players to lay out — `docs/rules.md` §6.6.
 * A casual game is not held to that order, so it is dealt with both armies already arranged, which
 * is what the app has always done and what every criterion written before this rule still asserts.
 */
it("deals a scored game with nobody having laid out, and a casual one with both", () => {
  const scored = gameReducer(opening(), formatChosen("Scored"));

  expect(scored.phase.hanSetup).toBeUndefined();
  expect(scored.phase.choSetup).toBeUndefined();
  expect(opening().phase.hanSetup?.name).toBe("Inner Elephant");
  expect(opening().phase.choSetup?.name).toBe("Inner Elephant");
});

/**
 * The reducers go through the engine's `place`, which throws rather than quietly ignoring a choice
 * the rule refuses. The pickers are disabled off `canPlace`, so reaching one is a bug at the
 * control — the same contract `moved` and `takenBack` already have.
 */
it("refuses cho a board han has not laid out yet", () => {
  const scored = gameReducer(opening(), formatChosen("Scored"));

  expect(() => gameReducer(scored, choSetupChosen(setup("Outer Elephant")))).toThrow(/han lays out first/);
});

it("refuses han a second arrangement in a scored game", () => {
  const scored = gameReducer(opening(), formatChosen("Scored"));
  const hanHasLaidOut = gameReducer(scored, hanSetupChosen(setup("Left Elephant")));

  expect(() => gameReducer(hanHasLaidOut, hanSetupChosen(setup("Right Elephant")))).toThrow(/may not lay out again/);
});

/** Starting again is not a way round it: the arrangements stand, and han still may not revise. */
it("keeps both arrangements when a scored game is restarted", () => {
  const scored = gameReducer(opening(), formatChosen("Scored"));
  const hanHasLaidOut = gameReducer(scored, hanSetupChosen(setup("Left Elephant")));
  const laidOut = gameReducer(hanHasLaidOut, choSetupChosen(setup("Inner Elephant")));

  const after = gameReducer(laidOut, restarted());

  expect(after.phase.hanSetup?.name).toBe("Left Elephant");
  expect(after.phase.choSetup?.name).toBe("Inner Elephant");
  expect(after.played.past).toEqual([]);
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

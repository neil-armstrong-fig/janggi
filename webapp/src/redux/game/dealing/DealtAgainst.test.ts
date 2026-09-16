import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {Opponent} from "@src/redux/game/types/Opponent";
import {dealtAgainst} from "@src/redux/game/dealing/DealtAgainst";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {freshPhaseFor} from "@src/redux/game/dealing/FreshPhaseFor";
import {playMove} from "@src/game/record/PlayMove";

const theBot: Opponent = {name: "Bot", botElo: 1600, sideChoice: "Han", playerSide: "han"};

it("takes the opponent it is given", () => {
  expect(dealtAgainst(firstGame(), theBot).opponent).toEqual(theBot);
});

it("deals a game with nothing played", () => {
  const begun = playMove(firstGame().played, {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}});

  expect(dealtAgainst({...firstGame(), played: begun}, theBot).played.past).toEqual([]);
});

it("keeps the format being played", () => {
  const scored: GameSliceState = {...firstGame(), phase: freshPhaseFor("Scored")};

  expect(dealtAgainst(scored, theBot).phase.format).toBe("Scored");
});

/**
 * The arrangements go, rather than carrying over: in a scored game they are the players' own, and whose
 * they are has just changed.
 */
it("hands a scored game back to its players to lay out", () => {
  const scored: GameSliceState = {...firstGame(), phase: freshPhaseFor("Scored")};

  expect(dealtAgainst(scored, theBot).phase.hanSetup).toBeUndefined();
  expect(dealtAgainst(scored, theBot).phase.choSetup).toBeUndefined();
});

it("deals a casual game with both armies already arranged", () => {
  expect(dealtAgainst(firstGame(), theBot).phase.hanSetup?.name).toBe("Inner Elephant");
  expect(dealtAgainst(firstGame(), theBot).phase.choSetup?.name).toBe("Inner Elephant");
});

import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {freshPhaseFor} from "@src/redux/game/dealing/FreshPhaseFor";
import {freshProgress} from "@src/redux/progress/fresh-progress/FreshProgress";
import {playMove} from "@src/game/record/PlayMove";
import {withinReach} from "@src/redux/game/within-reach/WithinReach";

const NOTHING_BEATEN = freshProgress().beaten;
const CHO_HAS_BEATEN_THE_WEAKEST = {...NOTHING_BEATEN, Casual: {cho: [800 as const], han: []}};

it("leaves a game set against a bot the player has reached exactly as it is", () => {
  const reachable = againstTheBot(800);

  expect(withinReach(reachable, NOTHING_BEATEN)).toBe(reachable);
});

it("deals a game not yet begun again, against the strongest bot the player has reached", () => {
  const tooStrong = againstTheBot(1600);

  expect(withinReach(tooStrong, CHO_HAS_BEATEN_THE_WEAKEST).opponent.botElo).toBe(1000);
});

it("leaves a game against the bot that is under way for the player to finish", () => {
  const begun = played(againstTheBot(1600));

  expect(withinReach(begun, NOTHING_BEATEN)).toBe(begun);
});

it("only moves the bot's strength down between two people, and leaves their game alone", () => {
  const begun = played({...firstGame(), opponent: {...firstGame().opponent, name: "Human", botElo: 1600}});

  const kept = withinReach(begun, NOTHING_BEATEN);

  expect(kept.opponent.botElo).toBe(800);
  expect(kept.played).toBe(begun.played);
});

it("measures the bot against the ladder of the format being played", () => {
  const scored: GameSliceState = {...againstTheBot(1000), phase: freshPhaseFor("Scored")};

  expect(withinReach(scored, CHO_HAS_BEATEN_THE_WEAKEST).opponent.botElo).toBe(800);
});

it("measures a Random side against what both armies have reached", () => {
  const random = {...againstTheBot(1000), opponent: {...againstTheBot(1000).opponent, sideChoice: "Random" as const}};

  expect(withinReach(random, CHO_HAS_BEATEN_THE_WEAKEST).opponent.botElo).toBe(800);
});

function againstTheBot(botElo: 800 | 1000 | 1600): GameSliceState {
  return {...firstGame(), opponent: {name: "Bot", botElo, sideChoice: "Cho", playerSide: "cho"}};
}

function played(state: GameSliceState): GameSliceState {
  return {...state, played: playMove(state.played, {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}})};
}

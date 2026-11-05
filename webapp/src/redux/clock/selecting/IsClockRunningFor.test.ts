import {clockReducer, clockStarted, timeControlChosen} from "@src/redux/clock/ClockSlice";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {isClockRunningFor} from "@src/redux/clock/selecting/IsClockRunningFor";
import {noFriendGame} from "@src/redux/online/NoFriendGame";
import type {ClockedState} from "@src/redux/clock/types/ClockedState";

const CHOSEN = clockReducer(undefined, timeControlChosen("5 min"));

it("is so only for the army to move, once a clock has started", () => {
  const state = stateWith(clockReducer(CHOSEN, clockStarted(1000)));

  expect(isClockRunningFor(state, "cho")).toBe(true);
  expect(isClockRunningFor(state, "han")).toBe(false);
});

it("is not so before a clock has started", () => {
  expect(isClockRunningFor(stateWith(CHOSEN), "cho")).toBe(false);
});

it("is not so where the game has no clock", () => {
  const state = stateWith(clockReducer(CHOSEN, clockStarted(1000)));
  const againstTheBot = {...state, game: {...state.game, opponent: {...state.game.opponent, name: "Bot" as const}}};

  expect(isClockRunningFor(againstTheBot, "cho")).toBe(false);
});

function stateWith(clock: ClockedState["clock"]): ClockedState {
  const game = firstGame();

  return {clock, friend: noFriendGame(), game: {...game, opponent: {...game.opponent, name: "Human"}}};
}

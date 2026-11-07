import {clockReducer, clockStarted, timeControlChosen, turnCharged} from "@src/redux/slices/clock/ClockSlice";
import {clockReadingFor} from "@src/redux/slices/clock/selecting/ClockReadingFor";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/slices/game/first-game/FirstGame";
import {noFriendGame} from "@src/redux/slices/online/NoFriendGame";
import type {ClockedState} from "@src/redux/slices/clock/types/ClockedState";
import type {ClockSliceState} from "@src/redux/slices/clock/types/ClockSliceState";

const FIVE_MINUTES = clockReducer(undefined, timeControlChosen("5 min"));
const RUNNING = clockReducer(FIVE_MINUTES, clockStarted(1000));

it("is nothing where the game has no clock", () => {
  expect(clockReadingFor(stateWith(clockReducer(undefined, clockStarted(1000))), "cho", 61_000)).toBeUndefined();
});

it("reads all the time before a clock has started, whatever the hour", () => {
  expect(clockReadingFor(stateWith(FIVE_MINUTES), "cho", 61_000)).toEqual({state: "free", seconds: 300, periods: 3});
});

it("takes the turn so far off the army to move, and only that army", () => {
  const state = stateWith(RUNNING);

  expect(clockReadingFor(state, "cho", 61_000)).toEqual({state: "free", seconds: 240, periods: 3});
  expect(clockReadingFor(state, "han", 61_000)).toEqual({state: "free", seconds: 300, periods: 3});
});

it("takes off nothing for a moment read from before the turn began", () => {
  expect(clockReadingFor(stateWith(RUNNING), "cho", 500)).toEqual({state: "free", seconds: 300, periods: 3});
});

it("takes what it holds off the army to move while it waits to be resumed, whatever the hour", () => {
  const state = stateWith({...FIVE_MINUTES, heldMs: 60_000});

  expect(clockReadingFor(state, "cho", 999_000)).toEqual({state: "free", seconds: 240, periods: 3});
  expect(clockReadingFor(state, "han", 999_000)).toEqual({state: "free", seconds: 300, periods: 3});
});

it("reads what each army has banked", () => {
  const state = stateWith(clockReducer(RUNNING, turnCharged({side: "han", at: 61_000, runsOn: false})));

  expect(clockReadingFor(state, "han", 99_000)).toEqual({state: "free", seconds: 240, periods: 3});
});

function stateWith(clock: ClockSliceState): ClockedState {
  const game = firstGame();

  return {clock, friend: noFriendGame(), game: {...game, opponent: {...game.opponent, name: "Human"}}};
}

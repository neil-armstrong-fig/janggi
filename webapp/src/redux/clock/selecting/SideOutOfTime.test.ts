import {clockPosed, clockReducer, timeControlChosen} from "@src/redux/clock/ClockSlice";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {noFriendGame} from "@src/redux/online/NoFriendGame";
import {sideOutOfTime} from "@src/redux/clock/selecting/SideOutOfTime";
import type {ClockedState} from "@src/redux/clock/types/ClockedState";
import type {ClockSliceState} from "@src/redux/clock/types/ClockSliceState";

it("is nobody until time is lost", () => {
  expect(sideOutOfTime(stateWith(clockReducer(undefined, timeControlChosen("5 min"))))).toBeUndefined();
});

it("is the army to move once time is lost", () => {
  const state = stateWith(clockReducer(clockReducer(undefined, timeControlChosen("5 min")), clockPosed("Time lost")));

  expect(sideOutOfTime(state)).toBe(state.game.played.present.sideToMove);
});

it("is nobody where the game has no clock", () => {
  expect(sideOutOfTime(stateWith(clockReducer(undefined, clockPosed("Time lost"))))).toBeUndefined();
});

function stateWith(clock: ClockSliceState): ClockedState {
  const game = firstGame();

  return {clock, friend: noFriendGame(), game: {...game, opponent: {...game.opponent, name: "Human"}}};
}

import {clockInUse} from "@src/redux/slices/clock/selecting/ClockInUse";
import {clockReducer, timeControlChosen} from "@src/redux/slices/clock/ClockSlice";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/slices/game/first-game/FirstGame";
import {noFriendGame} from "@src/redux/slices/online/NoFriendGame";
import type {ClockedState} from "@src/redux/slices/clock/types/ClockedState";

it("is the format chosen, between two people at one device", () => {
  expect(clockInUse(chosen())).toEqual({minutes: 5, periodSeconds: 30, periods: 3});
});

it("is nothing where the clock is off", () => {
  expect(clockInUse({...chosen(), clock: clockReducer(undefined, timeControlChosen("Off"))})).toBeUndefined();
});

it("is nothing against the bot", () => {
  const state = chosen();

  expect(
    clockInUse({...state, game: {...state.game, opponent: {...state.game.opponent, name: "Bot"}}}),
  ).toBeUndefined();
});

it("is nothing in a game with a friend", () => {
  expect(clockInUse({...chosen(), friend: {...noFriendGame("ABCD2345"), state: "choosing-setups"}})).toBeUndefined();
});

function chosen(): ClockedState {
  const game = firstGame();

  return {
    clock: clockReducer(undefined, timeControlChosen("5 min")),
    friend: noFriendGame(),
    game: {...game, opponent: {...game.opponent, name: "Human"}},
  };
}

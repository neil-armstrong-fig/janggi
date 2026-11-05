import {clockReducer, clockStarted, timeControlChosen, timeRanOut, turnCharged} from "@src/redux/clock/ClockSlice";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {noFriendGame} from "@src/redux/online/NoFriendGame";
import {sideOutOfTime} from "@src/redux/clock/selecting/SideOutOfTime";
import type {ClockedState} from "@src/redux/clock/types/ClockedState";
import type {ClockSliceState} from "@src/redux/clock/types/ClockSliceState";

const FIVE_MINUTES = clockReducer(undefined, timeControlChosen("5 min"));

it("is nobody until time is lost", () => {
  expect(sideOutOfTime(stateWith(FIVE_MINUTES))).toBeUndefined();
});

it("is the army whose time ran out", () => {
  expect(sideOutOfTime(stateWith(clockReducer(FIVE_MINUTES, timeRanOut("han"))))).toBe("han");
});

it("is the army whose last period ran out on its turn", () => {
  const running = clockReducer(FIVE_MINUTES, clockStarted(0));
  const overran = clockReducer(running, turnCharged({side: "han", at: 390_000, runsOn: true}));

  expect(sideOutOfTime(stateWith(overran))).toBe("han");
});

it("is nobody where the game has no clock", () => {
  expect(sideOutOfTime(stateWith(clockReducer(undefined, timeRanOut("han"))))).toBeUndefined();
});

it("is nobody against the bot, whatever the clock says", () => {
  const state = stateWith(clockReducer(FIVE_MINUTES, timeRanOut("han")));

  expect(sideOutOfTime({...state, game: firstGameAgainstTheBot()})).toBeUndefined();
});

function stateWith(clock: ClockSliceState): ClockedState {
  const game = firstGame();

  return {clock, friend: noFriendGame(), game: {...game, opponent: {...game.opponent, name: "Human"}}};
}

function firstGameAgainstTheBot(): ClockedState["game"] {
  const game = firstGame();

  return {...game, opponent: {...game.opponent, name: "Bot"}};
}

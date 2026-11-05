import {clockReducer, clockStarted, timeControlChosen} from "@src/redux/clock/ClockSlice";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {flagDueAt} from "@src/redux/clock/selecting/FlagDueAt";
import {noFriendGame} from "@src/redux/online/NoFriendGame";
import type {ClockedState} from "@src/redux/clock/types/ClockedState";
import type {ClockSliceState} from "@src/redux/clock/types/ClockSliceState";

const FIVE_MINUTES = clockReducer(undefined, timeControlChosen("5 min"));

it("is nothing before a clock has started", () => {
  expect(flagDueAt(stateWith(FIVE_MINUTES))).toBeUndefined();
});

it("is all the army's time on from when its turn began", () => {
  expect(flagDueAt(stateWith(clockReducer(FIVE_MINUTES, clockStarted(1000))))).toBe(391_000);
});

it("is the time of the army to move, not the army waiting", () => {
  const armies = {cho: {freeMs: 1000, periods: 0}, han: {freeMs: 300_000, periods: 3}};

  expect(flagDueAt(stateWith({...FIVE_MINUTES, armies, turnStartedAt: 1000}))).toBe(2000);
});

function stateWith(clock: ClockSliceState): ClockedState {
  const game = firstGame();

  return {clock, friend: noFriendGame(), game: {...game, opponent: {...game.opponent, name: "Human"}}};
}

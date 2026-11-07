import type {ClockedState} from "@src/redux/slices/clock/types/ClockedState";
import type {ClockSliceState} from "@src/redux/slices/clock/types/ClockSliceState";
import type {OpponentName} from "@janggi/shared/janggi/settings/OpponentName";
import {clockReducer, timeControlChosen} from "@src/redux/slices/clock/ClockSlice";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/slices/game/first-game/FirstGame";
import {gameReducer, moved} from "@src/redux/slices/game/GameSlice";
import {noFriendGame} from "@src/redux/slices/online/NoFriendGame";
import {sideWaitingToResume} from "@src/redux/slices/clock/selecting/SideWaitingToResume";

const FIVE_MINUTES = clockReducer(undefined, timeControlChosen("5 min"));

it("is the army to move while the clock holds a turn", () => {
  expect(sideWaitingToResume(stateWith({...FIVE_MINUTES, heldMs: 20_000}))).toBe("han");
});

it("is nobody while the clock holds nothing", () => {
  expect(sideWaitingToResume(stateWith(FIVE_MINUTES))).toBeUndefined();
});

it("is nobody where the game has no clock", () => {
  expect(sideWaitingToResume(stateWith({...FIVE_MINUTES, heldMs: 20_000}, "Bot"))).toBeUndefined();
});

function stateWith(clock: ClockSliceState, opponentName: OpponentName = "Human"): ClockedState {
  const game = gameReducer(firstGame(), moved({from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}));

  return {clock, friend: noFriendGame(), game: {...game, opponent: {...game.opponent, name: opponentName}}};
}

import type {ClockedState} from "@src/redux/slices/clock/types/ClockedState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {clockInUse} from "@src/redux/slices/clock/selecting/ClockInUse";

/** Whether time is passing for an army: it is the army to move, in a game on the clock, between its first move and its end. */
export function isClockRunningFor(state: ClockedState, side: Side): boolean {
  if (state.clock.turnStartedAt === undefined || !clockInUse(state)) return false;

  return state.game.played.present.sideToMove === side;
}

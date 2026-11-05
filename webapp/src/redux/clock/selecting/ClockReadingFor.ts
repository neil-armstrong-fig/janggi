import type {ClockReading} from "@src/redux/clock/reading/types/ClockReading";
import type {ClockedState} from "@src/redux/clock/types/ClockedState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {clockInUse} from "@src/redux/clock/selecting/ClockInUse";
import {clockReadingOf} from "@src/redux/clock/reading/ClockReadingOf";
import {isClockRunningFor} from "@src/redux/clock/selecting/IsClockRunningFor";

/**
 * What an army's clock shows at a given moment, in a game that has one: what it has banked, less the turn so far if it is
 * the army to move. A moment read from before the turn began counts as none of it, the page's reading of the time being
 * a beat behind a turn that has only just started. While the clock waits to be resumed, the turn so far is what it holds.
 */
export function clockReadingFor(state: ClockedState, side: Side, now: number): ClockReading | undefined {
  const timeControl = clockInUse(state);
  const {armies, turnStartedAt, heldMs} = state.clock;
  if (!timeControl || !armies) return undefined;

  if (heldMs !== undefined && state.game.played.present.sideToMove === side) {
    return clockReadingOf(armies[side], timeControl, heldMs);
  }

  if (!isClockRunningFor(state, side) || turnStartedAt === undefined) {
    return clockReadingOf(armies[side], timeControl, 0);
  }

  return clockReadingOf(armies[side], timeControl, Math.max(now - turnStartedAt, 0));
}

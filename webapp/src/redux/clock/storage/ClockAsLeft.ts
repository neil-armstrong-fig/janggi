import type {ClockSliceState} from "@src/redux/clock/types/ClockSliceState";
import type {WrittenClock} from "@src/redux/clock/storage/types/WrittenClock";

/**
 * The clock as the page writes it on its way out: stamped with the moment, if a turn is being timed, so that what the
 * turn has spent can be worked out on coming back.
 */
export function clockAsLeft(clock: ClockSliceState, now: number): WrittenClock {
  if (clock.turnStartedAt === undefined) return clock;

  return {...clock, leftAt: now};
}

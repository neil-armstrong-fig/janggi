import type {ClockSliceState} from "@src/redux/slices/clock/types/ClockSliceState";

/**
 * The clock as it is parked: a turn being timed stops, holding what it had spent by `now`, exactly as a reloaded page holds
 * it (`loadClock`) — so coming back asks the player to resume, and nothing ran against them while they were away.
 */
export function clockHeldAt(clock: ClockSliceState, now: number): ClockSliceState {
  const {turnStartedAt} = clock;
  if (turnStartedAt === undefined) return clock;

  return {...clock, turnStartedAt: undefined, heldMs: now - turnStartedAt};
}

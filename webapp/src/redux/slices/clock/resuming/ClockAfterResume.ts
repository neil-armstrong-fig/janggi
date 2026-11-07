import type {ClockSliceState} from "@src/redux/slices/clock/types/ClockSliceState";

/**
 * The clock started again on a turn it was holding after a reload: from now, less what the turn had already spent, so
 * the time away is not charged and the time spent before it stays spent. A clock holding nothing is left as it is.
 */
export function clockAfterResume(state: ClockSliceState, now: number): ClockSliceState {
  const {heldMs} = state;
  if (heldMs === undefined) return state;

  return {...state, turnStartedAt: now - heldMs, heldMs: undefined};
}

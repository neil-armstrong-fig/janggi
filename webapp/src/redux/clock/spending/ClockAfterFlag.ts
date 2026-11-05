import type {ClockSliceState} from "@src/redux/clock/types/ClockSliceState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** An army's time has run out on its turn (시간패): it has nothing left, and no clock runs on. */
export function clockAfterFlag(state: ClockSliceState, side: Side): ClockSliceState {
  if (!state.armies) return state;

  return {...state, armies: {...state.armies, [side]: {freeMs: 0, periods: 0}}, turnStartedAt: undefined};
}

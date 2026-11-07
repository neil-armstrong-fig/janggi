import type {ClockSliceState} from "@src/redux/slices/clock/types/ClockSliceState";

/** No clock at all, keeping only the format it was on and what was written for Custom, in case it is turned on again. */
export function clockTurnedOff(state: ClockSliceState): ClockSliceState {
  return {...state, name: "Off", armies: undefined, turnStartedAt: undefined, heldMs: undefined};
}

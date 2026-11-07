import type {ChargedTurn} from "@src/redux/slices/clock/types/ChargedTurn";
import type {ClockSliceState} from "@src/redux/slices/clock/types/ClockSliceState";
import {clockAfterTurn} from "@src/redux/slices/clock/spending/ClockAfterTurn";
import {isOutOfTime} from "@src/redux/slices/clock/spending/IsOutOfTime";
import {timeControlOf} from "@src/redux/slices/clock/time-controls/TimeControlOf";

/**
 * Charges a finished turn to the army that took it, and starts the next from the same moment. A turn that overran is
 * still charged in full, for a page whose timers slept in the background: that army has lost, and no clock runs on.
 */
export function clockAfterCharge(state: ClockSliceState, {side, at, runsOn}: ChargedTurn): ClockSliceState {
  const {armies, turnStartedAt} = state;
  const timeControl = timeControlOf(state.name, state.custom);
  if (!armies || !timeControl || turnStartedAt === undefined) return state;

  const armyClock = clockAfterTurn(armies[side], timeControl, at - turnStartedAt);
  const charged = {...state, armies: {...armies, [side]: armyClock}};

  if (!runsOn || isOutOfTime(armyClock)) return {...charged, turnStartedAt: undefined};

  return {...charged, turnStartedAt: at};
}

import type {ClockedState} from "@src/redux/slices/clock/types/ClockedState";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {clockInUse} from "@src/redux/slices/clock/selecting/ClockInUse";
import {isOutOfTime} from "@src/redux/slices/clock/spending/IsOutOfTime";

/**
 * The army that has lost on time (시간패), if one has. It reads only what is banked: a flag falling is dispatched, so
 * nothing that asks this has to be redrawn as time passes.
 */
export function sideOutOfTime(state: ClockedState): Side | undefined {
  const {armies} = state.clock;
  if (!armies || !clockInUse(state)) return undefined;

  return SIDES.find(side => isOutOfTime(armies[side]));
}

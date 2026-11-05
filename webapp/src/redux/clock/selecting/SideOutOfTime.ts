import type {ClockedState} from "@src/redux/clock/types/ClockedState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {clockInUse} from "@src/redux/clock/selecting/ClockInUse";

/** The army whose time has run out, which for now only the Time lost pose says: the army to move. */
export function sideOutOfTime(state: ClockedState): Side | undefined {
  if (state.clock.pose !== "Time lost" || !clockInUse(state)) return undefined;

  return state.game.played.present.sideToMove;
}

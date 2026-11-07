import type {ClockedState} from "@src/redux/slices/clock/types/ClockedState";
import {clockInUse} from "@src/redux/slices/clock/selecting/ClockInUse";
import {msLeftOf} from "@src/redux/slices/clock/spending/MsLeftOf";

/** When the army to move will have lost on time if it has not moved, while a clock is running. */
export function flagDueAt(state: ClockedState): number | undefined {
  const timeControl = clockInUse(state);
  const {armies, turnStartedAt} = state.clock;
  if (!timeControl || !armies || turnStartedAt === undefined) return undefined;

  return turnStartedAt + msLeftOf(armies[state.game.played.present.sideToMove], timeControl);
}

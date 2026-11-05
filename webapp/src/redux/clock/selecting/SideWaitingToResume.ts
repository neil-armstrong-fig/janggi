import type {ClockedState} from "@src/redux/clock/types/ClockedState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {clockInUse} from "@src/redux/clock/selecting/ClockInUse";

/** The army whose turn waits to be resumed after a reload, if one does. Nothing can be played until it is. */
export function sideWaitingToResume(state: ClockedState): Side | undefined {
  if (state.clock.heldMs === undefined || !clockInUse(state)) return undefined;

  return state.game.played.present.sideToMove;
}

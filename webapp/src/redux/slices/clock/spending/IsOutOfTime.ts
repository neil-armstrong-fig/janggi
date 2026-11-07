import type {ArmyClock} from "@src/redux/slices/clock/types/ArmyClock";

/** Whether an army has nothing left, which loses it the game (시간패). */
export function isOutOfTime({freeMs, periods}: ArmyClock): boolean {
  return freeMs === 0 && periods === 0;
}

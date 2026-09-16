import {isFiniteNumber} from "@src/redux/untrusted/IsFiniteNumber";

/** Whether a value read from outside is a real number no smaller than `least` and no larger than `most`. */
export function isNumberBetween(value: unknown, least: number, most: number): value is number {
  return isFiniteNumber(value) && value >= least && value <= most;
}

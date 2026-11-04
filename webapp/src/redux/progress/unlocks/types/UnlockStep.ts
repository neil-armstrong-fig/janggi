import type {UnlockItem} from "@src/redux/progress/unlocks/types/UnlockItem";

/** One rung of the unlock ladder: an amount of XP, and everything that opens at it. */
export interface UnlockStep {
  readonly xp: number;
  readonly items: readonly UnlockItem[];
}

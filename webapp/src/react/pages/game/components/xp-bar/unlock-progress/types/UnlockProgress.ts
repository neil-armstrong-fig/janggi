import type {UnlockStep} from "@src/redux/progress/unlocks/types/UnlockStep";

/** How far XP has come between the unlock last passed and the one it is working towards. */
export interface UnlockProgress {
  /** The XP of the last unlock passed — 0 before the first. */
  readonly previousXp: number;
  readonly next: UnlockStep;
  /** From 0, at the last unlock, to 1, at the next. */
  readonly fraction: number;
}

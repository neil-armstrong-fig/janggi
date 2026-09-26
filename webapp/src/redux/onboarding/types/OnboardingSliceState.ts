import type {OnboardingStage} from "@janggi/shared/janggi/onboarding/OnboardingStage";

/**
 * How far a player has been shown around: the welcome, the tour and, at `tourStep`, which of its steps,
 * or neither any more. Kept on the device so a reload half way through the tour comes back to the same
 * step, and so a player who skipped it is not shown it again. `tourStep` is 0 in every other stage.
 */
export interface OnboardingSliceState {
  readonly stage: OnboardingStage;
  readonly tourStep: number;
}

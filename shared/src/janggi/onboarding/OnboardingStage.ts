/** Where a player is in being shown around: the welcome, the tour over the real page, or neither any more. */
export const ONBOARDING_STAGES = ["welcome", "tour", "done"] as const;

export type OnboardingStage = (typeof ONBOARDING_STAGES)[number];

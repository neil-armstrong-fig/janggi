import type {OnboardingStage} from "./OnboardingStage.js";

/**
 * Where the onboarding is kept in `localStorage`. Versioned, so a later change to its shape can be read
 * under a new key rather than misread under this one.
 */
export const ONBOARDING_STORAGE_KEY = "janggi.onboarding.v1";

/**
 * What the app writes under `ONBOARDING_STORAGE_KEY` for a player who has been shown around, or skipped it.
 *
 * Shared because the acceptance tests start every spec as a returning player by keeping exactly this, so
 * the welcome never stands between a spec and the board — the same bytes the app would have written, not a
 * second copy of the format. The app's loader is tested against it, so the two cannot drift apart unseen.
 */
export const ONBOARDING_DONE_JSON = JSON.stringify({stage: "done" satisfies OnboardingStage, tourStep: 0});

import type {Page} from "@playwright/test";

/** Longer than a flight, a capture landing and the shake after it take together. */
const SETTLES_WITHIN_MS = 4_000;

/**
 * Waits until every animation and transition on the page that ends has ended. One that repeats
 * forever — a general under attack pulsing — is left running, since waiting on it would never finish.
 */
export async function motionSettled(page: Page): Promise<void> {
  await page.waitForFunction(
    () => {
      return document.getAnimations().every(animation => {
        return animation.playState !== "running" || animation.effect?.getComputedTiming().iterations === Infinity;
      });
    },
    undefined,
    {timeout: SETTLES_WITHIN_MS},
  );
}

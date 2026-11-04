import type {AcceptanceTestOptions} from "./src/acceptance-criteria-mapping/AcceptanceTestFixtures";
import baseConfig, {PWA_SPECS} from "./playwright.config";
import {defineConfig, devices} from "@playwright/test";

/**
 * Has Chromium show notifications itself rather than through the operating system. With the system's, a notification the worker has
 * shown intermittently vanishes from the registration's list moments later, even when nothing read the list until it was shown.
 */
const NOTIFICATIONS_IN_THE_BROWSER = "--disable-features=NativeNotifications,SystemNotifications";

/**
 * Service-worker release handling against a compiled app. The ordinary suite runs happily against
 * Vite's development server, where the production worker is deliberately absent; this suite is
 * separate so its browser sees the same worker lifecycle as GitHub Pages.
 */
export default defineConfig<AcceptanceTestOptions>({
  ...baseConfig,
  projects: [
    {
      name: "desktop-pwa",
      testMatch: PWA_SPECS,
      use: {
        ...devices["Desktop Chrome"],
        channel: "chromium",
        launchOptions: {args: [NOTIFICATIONS_IN_THE_BROWSER]},
        reducedMotion: "reduce",
        effects: "Reduced",
      },
    },
    {
      name: "mobile-pwa",
      testMatch: PWA_SPECS,
      use: {
        ...devices["Pixel 5"],
        channel: "chromium",
        launchOptions: {args: [NOTIFICATIONS_IN_THE_BROWSER]},
        reducedMotion: "reduce",
        effects: "Reduced",
      },
    },
  ],
});

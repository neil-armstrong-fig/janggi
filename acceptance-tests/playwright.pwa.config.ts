import type {AcceptanceTestOptions} from "./src/acceptance-criteria-mapping/AcceptanceTestFixtures";
import baseConfig, {PWA_SPECS} from "./playwright.config";
import {defineConfig, devices} from "@playwright/test";

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
      use: {...devices["Desktop Chrome"], reducedMotion: "reduce", effects: "Reduced"},
    },
    {
      name: "mobile-pwa",
      testMatch: PWA_SPECS,
      use: {...devices["Pixel 5"], reducedMotion: "reduce", effects: "Reduced"},
    },
  ],
});

import type {AcceptanceTestOptions} from "./src/acceptance-criteria-mapping/AcceptanceTestFixtures";
import baseConfig, {UNRELEASED_SPECS} from "./playwright.config";
import {defineConfig, devices} from "@playwright/test";

/**
 * The work not yet in production, which any server shows once the address asks for it, so each project opens the app
 * with `?IN_DEVELOPMENT=true`. The default projects ignore these, as a player opening the site does not see that work.
 * A failure here goes red but gates no deploy, so half-built work never holds up a release.
 */
export default defineConfig<AcceptanceTestOptions>({
  ...baseConfig,
  projects: [
    {
      name: "desktop-unreleased",
      testMatch: UNRELEASED_SPECS,
      use: {...devices["Desktop Chrome"], reducedMotion: "reduce", effects: "Reduced", inDevelopment: true},
    },
    {
      name: "mobile-unreleased",
      testMatch: UNRELEASED_SPECS,
      use: {...devices["Pixel 5"], reducedMotion: "reduce", effects: "Reduced", inDevelopment: true},
    },
  ],
});

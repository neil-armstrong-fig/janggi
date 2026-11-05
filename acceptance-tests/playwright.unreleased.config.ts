import type {AcceptanceTestOptions} from "./src/acceptance-criteria-mapping/AcceptanceTestFixtures";
import baseConfig, {UNRELEASED_SPECS} from "./playwright.config";
import {defineConfig, devices} from "@playwright/test";

/**
 * The work not yet in production, which only a build with it switched on can show: the development server, or
 * one compiled with `VITE_UNRELEASED=true`. The default projects ignore these, since that suite also runs against
 * the live site. A failure here goes red but gates no deploy, so half-built work never holds up a release.
 */
export default defineConfig<AcceptanceTestOptions>({
  ...baseConfig,
  projects: [
    {
      name: "desktop-unreleased",
      testMatch: UNRELEASED_SPECS,
      use: {...devices["Desktop Chrome"], reducedMotion: "reduce", effects: "Reduced"},
    },
    {
      name: "mobile-unreleased",
      testMatch: UNRELEASED_SPECS,
      use: {...devices["Pixel 5"], reducedMotion: "reduce", effects: "Reduced"},
    },
  ],
});

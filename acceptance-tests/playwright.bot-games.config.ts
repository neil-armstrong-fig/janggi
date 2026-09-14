import type {AcceptanceTestOptions} from "./src/acceptance-criteria-mapping/AcceptanceTestFixtures";
import baseConfig, {BOT_GAME_SPECS} from "./playwright.config";
import {defineConfig, devices} from "@playwright/test";

/**
 * The bot games only, which `playwright.config.ts` leaves out: everything about how a spec runs is
 * that config's, and only the projects differ. Desktop and mobile both, with the effects turned down,
 * as the ordinary projects run.
 */
export default defineConfig<AcceptanceTestOptions>({
  ...baseConfig,
  projects: [
    {
      name: "desktop-bot-games",
      testMatch: BOT_GAME_SPECS,
      use: {...devices["Desktop Chrome"], reducedMotion: "reduce", effects: "Reduced"},
    },
    {
      name: "mobile-bot-games",
      testMatch: BOT_GAME_SPECS,
      use: {...devices["Pixel 5"], reducedMotion: "reduce", effects: "Reduced"},
    },
  ],
});

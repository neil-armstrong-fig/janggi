import type {AcceptanceTestOptions} from "./src/acceptance-criteria-mapping/AcceptanceTestFixtures";
import {defineConfig, devices} from "@playwright/test";

/**
 * Which deployment the acceptance tests drive. The package scripts set this — there is no notion
 * of an "environment" in the tests themselves any more, only a URL.
 */
const webappUrl = process.env["WEBAPP_URL"] ?? "http://localhost:3000";

const isCi = !!process.env["CI"];

/**
 * The specs about the motion itself. Everything else runs with the game's effects turned down before
 * it starts, and with the device asking for reduced motion so the settings sheet and the plaques do
 * not slide or fade either — so an ordinary spec never waits on, or races, a piece still in flight. The
 * handful that are about the motion run on projects of their own, with it all left on.
 */
const EFFECTS_SPECS = "**/effects/**";

/**
 * The whole games against the bot, which this config leaves out. A game is minutes of bots thinking,
 * and the engine is not deterministic, so they run apart from the gate a deploy waits on — through
 * `playwright.bot-games.config.ts`, in `.github/workflows/bot-games.yml`.
 */
export const BOT_GAME_SPECS = "**/bot/PlayingTheBotToTheEnd.test.ts";

/**
 * Service-worker updates, which need a production build: the development server deliberately does
 * not register the app's production worker. `playwright.pwa.config.ts` runs these against preview.
 */
export const PWA_SPECS = "**/pwa/**";

export default defineConfig<AcceptanceTestOptions>({
  testDir: "./src/tests",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  reporter: isCi ? [["github"], ["html", {open: "never"}]] : [["list"]],
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: webappUrl,
    actionTimeout: 5_000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      testIgnore: [EFFECTS_SPECS, BOT_GAME_SPECS, PWA_SPECS],
      use: {...devices["Desktop Chrome"], reducedMotion: "reduce", effects: "Reduced"},
    },
    // A real touch viewport, so tap targets and layout are covered on every run.
    {
      name: "mobile",
      testIgnore: [EFFECTS_SPECS, BOT_GAME_SPECS, PWA_SPECS],
      use: {...devices["Pixel 5"], reducedMotion: "reduce", effects: "Reduced"},
    },

    {
      name: "desktop-effects",
      testMatch: EFFECTS_SPECS,
      use: {...devices["Desktop Chrome"], reducedMotion: "no-preference", effects: "Full"},
    },
    {
      name: "mobile-effects",
      testMatch: EFFECTS_SPECS,
      use: {...devices["Pixel 5"], reducedMotion: "no-preference", effects: "Full"},
    },
  ],
});

import {defineConfig, devices} from "@playwright/test";

/**
 * Which deployment the acceptance tests drive. The package scripts set this — there is no notion
 * of an "environment" in the tests themselves any more, only a URL.
 */
const webappUrl = process.env["WEBAPP_URL"] ?? "http://localhost:3000";

const isCi = !!process.env["CI"];

export default defineConfig({
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
    {name: "desktop", use: {...devices["Desktop Chrome"]}},
    // A real touch viewport, so tap targets and layout are covered on every run.
    {name: "mobile", use: {...devices["Pixel 5"]}},
  ],
});

import type {Page} from "@playwright/test";
import {BasePage} from "@src/dsl/playwright/BasePage";

/**
 * The app, and the only screen it has. The bottom of the stack: this is the layer that actually
 * drives Playwright, and the only one that may.
 *
 * It owns the browser — opening the app, and the window it is viewed through — and nothing else.
 * The areas of the screen are not its children: each one's `*Dsl` builds its own counterpart from
 * the same page, so this is the counterpart of `JanggiDsl` and no other object's parent. Nothing
 * here catches anything: a failure comes out as whatever Playwright threw, and `JanggiDsl` above is
 * what turns it into a sentence about the intention.
 */
export class JanggiPlaywright extends BasePage {
  /** Declared only because `BasePage`'s constructor is protected; there is nothing of its own to set up. */
  constructor(page: Page) {
    super(page);
  }

  /**
   * Relative to the `baseURL` in `playwright.config.ts`, which the package scripts choose. "./"
   * rather than "/" so a deployment served from a subpath — GitHub Pages — is not skipped past.
   *
   * Opened means cross-origin isolated. GitHub Pages cannot send the headers for that, so on a first
   * visit — which every test's fresh context is — the app's service worker takes control a moment
   * after load and the page reloads under it (`webapp/src/main.tsx`). A spec that started tapping
   * before then would lose its taps to the reload. Locally the server sends the headers and this
   * returns at once.
   */
  async open(): Promise<void> {
    await this.page.goto("./");
    await this.page.waitForFunction(() => globalThis.crossOriginIsolated, undefined, {timeout: ISOLATION_TIMEOUT_MS});
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  async resizeWindowTo(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({width, height});
  }
}

/**
 * How long a first visit may take to come back isolated. The service worker precaches the engine's
 * wasm before it takes control, which is seconds on a slow runner — past the config's action timeout.
 */
const ISOLATION_TIMEOUT_MS = 15_000;

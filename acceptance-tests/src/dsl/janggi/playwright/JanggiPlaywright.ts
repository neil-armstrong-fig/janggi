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
   */
  async open(): Promise<void> {
    await this.page.goto("./");
  }

  async resizeWindowTo(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({width, height});
  }
}

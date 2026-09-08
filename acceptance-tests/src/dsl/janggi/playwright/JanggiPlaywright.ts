import type {Page} from "@playwright/test";
import {BasePage} from "@src/dsl/playwright/BasePage";
import {BoardPlaywright} from "@src/dsl/janggi/components/board/playwright/BoardPlaywright";
import {SettingsPlaywright} from "@src/dsl/janggi/components/settings/playwright/SettingsPlaywright";
import {StatusPlaywright} from "@src/dsl/janggi/components/status/playwright/StatusPlaywright";

/**
 * The app, and the only screen it has. The bottom of the stack: this is the layer that actually
 * drives Playwright, and the only one that may.
 *
 * It owns the browser — opening the app and the window it is viewed through — and composes one
 * component per area of the screen. Nothing here catches anything: a failure comes out as whatever
 * Playwright threw, and `JanggiDsl` above is what turns it into a sentence about the intention.
 */
export class JanggiPlaywright extends BasePage {
  readonly board: BoardPlaywright;
  readonly settings: SettingsPlaywright;
  readonly status: StatusPlaywright;

  constructor(page: Page) {
    super(page);

    this.board = new BoardPlaywright(page);
    this.settings = new SettingsPlaywright(page);
    this.status = new StatusPlaywright(page);
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

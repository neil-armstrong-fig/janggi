import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/**
 * The locators behind `BotEngineNoticeDsl` — the notice over the board while the bot's engine cannot be started. Whether the bot is loading or unavailable is the game's state, on `status`.
 */
export class BotEngineNoticePlaywright extends BaseComponent {
  private readonly botEngineRetry: Locator;

  constructor(page: Page) {
    super(page);

    this.botEngineRetry = page.getByTestId("bot-engine-retry");
  }

  /** Presses the button over the board that tries to start the bot's engine again. */
  async retryTheBot(): Promise<void> {
    await this.botEngineRetry.click();
  }
}

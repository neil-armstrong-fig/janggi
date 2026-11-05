import {BotEngineNoticePlaywright} from "@src/dsl/janggi/components/status/components/board-overlay/components/bot-engine-notice/playwright/BotEngineNoticePlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import type {Page} from "@playwright/test";

/**
 * The notice over the board while the bot's engine cannot be started, reached as
 * `janggi.status.overlay.botEngineNotice`. Whether the bot is loading or unavailable is the game's state, on `status`.
 */
export class BotEngineNoticeDsl {
  private readonly botEngineNotice: BotEngineNoticePlaywright;

  constructor(page: Page) {
    this.botEngineNotice = new BotEngineNoticePlaywright(page);
  }

  /** Asks for the bot to be started again after it could not be. */
  async retryTheBot(): Promise<void> {
    try {
      await this.botEngineNotice.retryTheBot();
    } catch (error) {
      throw new DslError("Failed to try starting the bot again", error);
    }
  }
}

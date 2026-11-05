import {BotGoAheadPlaywright} from "@src/dsl/janggi/components/status/components/board-overlay/components/bot-go-ahead/playwright/BotGoAheadPlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import type {Page} from "@playwright/test";

/**
 * The button over the board that lets the bot make the game's first move, reached as `janggi.status.overlay.botGoAhead`.
 */
export class BotGoAheadDsl {
  private readonly botGoAhead: BotGoAheadPlaywright;

  constructor(page: Page) {
    this.botGoAhead = new BotGoAheadPlaywright(page);
  }

  /** Lets as long pass as the bot would take to open, for a spec claiming it has not. */
  async giveTheBotTimeToOpen(): Promise<void> {
    try {
      await this.botGoAhead.giveTheBotTimeToOpen();
    } catch (error) {
      throw new DslError("Failed to wait as long as the bot takes to open", error);
    }
  }

  /** Lets the bot make the first move of the game, which it holds until the player says so. */
  async letTheBotStart(): Promise<void> {
    try {
      await this.botGoAhead.letTheBotStart();
    } catch (error) {
      throw new DslError("Failed to let the bot start the game", error);
    }
  }

  /** Whether the bot is holding the game's first move until the player lets it start. */
  async isWaitingToLetTheBotStart(): Promise<boolean> {
    try {
      return await this.botGoAhead.isWaitingToLetTheBotStart();
    } catch (error) {
      throw new DslError("Failed to read whether the bot is waiting to be let start", error);
    }
  }
}

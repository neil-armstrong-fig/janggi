import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {botEngineLoaded} from "@src/dsl/janggi/components/status/playwright/bot-engine/BotEngineLoaded";

/** Well past the bot's least thinking time and the engine's first load, at the bottom rung. */
const BOT_OPENS_WITHIN_MS = 4_000;

/**
 * The locators behind `BotGoAheadDsl` — the button over the board that lets the bot make the game's first move.
 */
export class BotGoAheadPlaywright extends BaseComponent {
  private readonly botGoAhead: Locator;

  constructor(page: Page) {
    super(page);

    this.botGoAhead = page.getByTestId("bot-go-ahead");
  }

  /**
   * Lets as long pass as a bottom-rung bot takes to open, engine load included. A fixed wait, because
   * what it serves is a claim that something does **not** happen — the bot playing a move nobody let
   * it — and there is no attribute to wait on for the absence of a move.
   */
  async giveTheBotTimeToOpen(): Promise<void> {
    await this.page.waitForTimeout(BOT_OPENS_WITHIN_MS);
  }

  /**
   * Presses the button over the board that lets the bot make the game's first move. The button is not
   * there while the bot's engine is loading, so this waits for that first.
   */
  async letTheBotStart(): Promise<void> {
    await botEngineLoaded(this.page);
    await this.botGoAhead.click();
  }

  /**
   * Whether the board is holding the bot's first move until the player lets it start. Counted rather
   * than waited for: the button is drawn in the same render as the change that puts the bot on move —
   * **once the bot's engine is up**. While it is loading a notice covers the board instead, so this waits
   * for that first, or it would count no button for as long as the engine took.
   */
  async isWaitingToLetTheBotStart(): Promise<boolean> {
    await botEngineLoaded(this.page);

    return (await this.botGoAhead.count()) > 0;
  }
}

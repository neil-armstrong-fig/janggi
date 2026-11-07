import {appearsWithin} from "@src/dsl/playwright/visibility/AppearsWithin";
import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {botEngineLoaded} from "@src/dsl/janggi/components/status/playwright/bot-engine/BotEngineLoaded";

/** Well past the bot's least thinking time and the engine's first load, at the bottom rung. */
const BOT_OPENS_WITHIN_MS = 4_000;

/**
 * The locators behind `BotGoAheadDsl` — the button over the board that lets the bot make the game's first move.
 */
export class BotGoAheadPlaywright extends BaseComponent {
  private readonly turn: Locator;
  private readonly loadingTurn: Locator;
  private readonly botGoAhead: Locator;
  private readonly hansTurn: Locator;

  constructor(page: Page) {
    super(page);
    this.turn = page.getByTestId("turn");
    this.loadingTurn = page.locator("[data-testid='turn'][data-bot-loading]");

    this.botGoAhead = page.getByTestId("bot-go-ahead");
    this.hansTurn = page.locator("[data-testid='turn'][data-side='han']");
  }

  /**
   * Gives the bot its opening window. A turn handed to Han ends the observation early; otherwise
   * the bounded wait expires and the criterion reads whether Cho is still waiting to open.
   */
  async giveTheBotTimeToOpen(): Promise<void> {
    await appearsWithin(this.hansTurn, {state: "attached", timeout: BOT_OPENS_WITHIN_MS});
  }

  /**
   * Presses the button over the board that lets the bot make the game's first move. The button is not
   * there while the bot's engine is loading, so this waits for that first.
   */
  async letTheBotStart(): Promise<void> {
    await botEngineLoaded(this.turn, this.loadingTurn);
    await this.botGoAhead.click();
  }

  /**
   * Whether the board is holding the bot's first move until the player lets it start. Counted rather
   * than waited for: the button is drawn in the same render as the change that puts the bot on move —
   * **once the bot's engine is up**. While it is loading a notice covers the board instead, so this waits
   * for that first, or it would count no button for as long as the engine took.
   */
  async isWaitingToLetTheBotStart(): Promise<boolean> {
    await botEngineLoaded(this.turn, this.loadingTurn);

    return (await this.botGoAhead.count()) > 0;
  }
}

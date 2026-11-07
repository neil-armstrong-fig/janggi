import type {Locator, Page} from "@playwright/test";
import {DRAWN_BY} from "@janggi/shared/janggi/results/DrawnBy";
import type {DrawnBy} from "@janggi/shared/janggi/results/DrawnBy";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {botEngineLoaded} from "@src/dsl/janggi/components/status/playwright/bot-engine/BotEngineLoaded";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";

const BOT_REPLIES_WITHIN_MS = 20_000;

/** Where the game says what it is doing, rather than what is standing on it. */
export class StatusPlaywright extends BaseComponent {
  private readonly container: Locator;
  private readonly loadingTurn: Locator;
  private readonly unavailableTurn: Locator;
  private readonly botTurn: Locator;

  constructor(page: Page) {
    super(page);

    this.container = page.getByTestId("turn");

    this.loadingTurn = this.page.locator("[data-testid='turn'][data-bot-loading]");
    this.unavailableTurn = this.page.locator("[data-testid='turn'][data-bot-unavailable]");
    this.botTurn = this.page.locator("[data-testid='turn'][data-bot-to-move]");
  }

  /**
   * Whether the turn line says the bot's engine is still loading. Counted rather than waited for: it is
   * derived from the store in the same render that chooses the bot, so its absence is the answer.
   */
  async isWaitingForTheBotToLoad(): Promise<boolean> {
    return (await this.loadingTurn.count()) > 0;
  }

  /** Whether the turn line says the bot's engine could not be started. */
  async isTheBotUnavailable(): Promise<boolean> {
    return (await this.unavailableTurn.count()) > 0;
  }

  /** Waits for the bot's engine to finish loading, which the turn line marks with `data-bot-loading`. */
  async waitForTheBotToLoad(): Promise<void> {
    await botEngineLoaded(this.container, this.loadingTurn);
  }

  /**
   * The turn line carries `data-bot-to-move` for exactly as long as the bot is the one being waited on,
   * so this waits for it to go. It is derived from the position on every render, never set by a timer,
   * so it is already there by the time the tap that handed the bot its turn returns.
   *
   * A generous timeout of its own, because the first reply includes loading the engine.
   */
  async waitForTheBot(): Promise<void> {
    await this.container.waitFor({state: "visible"});
    await this.botTurn.waitFor({state: "detached", timeout: BOT_REPLIES_WITHIN_MS});
  }

  /**
   * Whether the game is still being laid out — 판차림 — rather than played. Only a scored game ever
   * says so; a casual one puts the usual arrangement out and starts.
   *
   * `getTurn` names the army it is waiting on either way, so a spec asks this first and then asks
   * whose go it is.
   */
  async isLayingOut(): Promise<boolean> {
    await this.container.waitFor({state: "visible"});

    return ((await this.container.getAttribute("data-laying-out")) ?? undefined) !== undefined;
  }

  /** Whether the army to move is in check. */
  async isInCheck(): Promise<boolean> {
    await this.container.waitFor({state: "visible"});

    return ((await this.container.getAttribute("data-in-check")) ?? undefined) !== undefined;
  }

  /** The army that has won, or undefined while the game is still being played. */
  async getWinner(): Promise<Side | undefined> {
    await this.container.waitFor({state: "visible"});

    const winner = await this.container.getAttribute("data-winner");

    return SIDES.find(candidate => candidate === winner);
  }

  /** Whether the game ended drawn, which only a casual game does. */
  async isDrawn(): Promise<boolean> {
    await this.container.waitFor({state: "visible"});

    return ((await this.container.getAttribute("data-drawn")) ?? undefined) !== undefined;
  }

  /** How the game was drawn, which the turn line carries as `data-drawn`. */
  async getDrawnBy(): Promise<DrawnBy | undefined> {
    await this.container.waitFor({state: "visible"});

    const drawnBy = await this.container.getAttribute("data-drawn");

    return DRAWN_BY.find(candidate => candidate === drawnBy);
  }

  /**
   * Which army is to move, read from `data-side` rather than from the words on screen, so the
   * wording can change without breaking a spec.
   *
   * The value is validated against the real union, the way `parsePieceKey` does it, so an attribute
   * naming an army that does not exist comes back as "nothing there" rather than as a `Side`.
   */
  async isTurnLineSelectable(): Promise<boolean> {
    await this.container.waitFor({state: "visible"});

    return await this.container.evaluate(element => getComputedStyle(element).userSelect !== "none");
  }

  async getTurn(): Promise<Side | undefined> {
    await this.container.waitFor({state: "visible"});

    const side = await this.container.getAttribute("data-side");

    return SIDES.find(candidate => candidate === side);
  }
}

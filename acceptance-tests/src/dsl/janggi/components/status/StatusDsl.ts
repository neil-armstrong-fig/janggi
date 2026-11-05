import {DslError} from "@src/dsl/errors/DslError";
import type {DrawnBy} from "@janggi/shared/janggi/results/DrawnBy";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {StatusPlaywright} from "@src/dsl/janggi/components/status/playwright/StatusPlaywright";
import {ControlsDsl} from "@src/dsl/janggi/components/status/components/controls/ControlsDsl";
import {PlayerPlaqueDsl} from "@src/dsl/janggi/components/status/components/player-plaque/PlayerPlaqueDsl";
import {BoardOverlayDsl} from "@src/dsl/janggi/components/status/components/board-overlay/BoardOverlayDsl";
import type {Page} from "@playwright/test";

/**
 * What the game says about itself, reached as `janggi.status`.
 *
 * Its own member rather than part of `board` or `settings`: whose turn it is belongs to neither the
 * pieces nor the controls. What is here is the game's own state, read off the turn line — whose turn, check, the end,
 * the bot's engine. The rest is a member per part of the screen, as the app's `status/components/` is: the row of
 * `controls`, each army's `plaque`, and what the `overlay` puts over the board.
 */
export class StatusDsl {
  private readonly status: StatusPlaywright;

  readonly controls: ControlsDsl;
  readonly plaque: PlayerPlaqueDsl;
  readonly overlay: BoardOverlayDsl;

  constructor(page: Page) {
    this.status = new StatusPlaywright(page);

    this.controls = new ControlsDsl(page);
    this.plaque = new PlayerPlaqueDsl(page);
    this.overlay = new BoardOverlayDsl(page);
  }

  /**
   * Whether the board is still being laid out rather than played — the scored game's 판차림 phase,
   * in which Han arranges first and Cho answers. `getTurn` says which army it is waiting on.
   */
  async isLayingOut(): Promise<boolean> {
    try {
      return await this.status.isLayingOut();
    } catch (error) {
      throw new DslError("Failed to read whether the board is still being laid out", error);
    }
  }

  /**
   * Waits while it is the bot's turn — to lay out or to move — and returns once it has played. Returns
   * at once when the bot is not the one being waited on.
   */
  async waitForTheBot(): Promise<void> {
    try {
      await this.status.waitForTheBot();
    } catch (error) {
      throw new DslError("Failed to wait for the bot to play", error);
    }
  }

  /** Whether the army to move is in check. */
  async isInCheck(): Promise<boolean> {
    try {
      return await this.status.isInCheck();
    } catch (error) {
      throw new DslError("Failed to read whether the army to move is in check", error);
    }
  }

  /** The army that has won, or undefined while the game is still being played. */
  async getWinner(): Promise<Side | undefined> {
    try {
      return await this.status.getWinner();
    } catch (error) {
      throw new DslError("Failed to read which army has won", error);
    }
  }

  /** Whether the game ended in a draw. */
  async isDrawn(): Promise<boolean> {
    try {
      return await this.status.isDrawn();
    } catch (error) {
      throw new DslError("Failed to read whether the game was drawn", error);
    }
  }

  /** How the game was drawn, or undefined where it was not. */
  async getDrawnBy(): Promise<DrawnBy | undefined> {
    try {
      return await this.status.getDrawnBy();
    } catch (error) {
      throw new DslError("Failed to read how the game was drawn", error);
    }
  }

  /** Whether the line saying whose turn it is can be selected as text, which the words of a game should not be. */
  async isTurnLineSelectable(): Promise<boolean> {
    try {
      return await this.status.isTurnLineSelectable();
    } catch (error) {
      throw new DslError("Failed to read whether the turn line can be selected", error);
    }
  }

  /** Which army is to move. */
  async getTurn(): Promise<Side | undefined> {
    try {
      return await this.status.getTurn();
    } catch (error) {
      throw new DslError("Failed to read whose turn it is", error);
    }
  }

  /** Whether the game is saying the bot's engine has not finished loading, and holding the board until it has. */
  async isWaitingForTheBotToLoad(): Promise<boolean> {
    try {
      return await this.status.isWaitingForTheBotToLoad();
    } catch (error) {
      throw new DslError("Failed to read whether the bot is still loading", error);
    }
  }

  /** Whether the game is saying the bot could not be started, and offering to try again. */
  async isTheBotUnavailable(): Promise<boolean> {
    try {
      return await this.status.isTheBotUnavailable();
    } catch (error) {
      throw new DslError("Failed to read whether the bot is unavailable", error);
    }
  }

  /** Waits for the bot to finish loading, and returns at once when it is not loading. */
  async waitForTheBotToLoad(): Promise<void> {
    try {
      await this.status.waitForTheBotToLoad();
    } catch (error) {
      throw new DslError("Failed to wait for the bot to load", error);
    }
  }
}

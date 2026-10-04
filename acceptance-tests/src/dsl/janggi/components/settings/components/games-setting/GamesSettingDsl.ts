import type {GameShown} from "@janggi/shared/janggi/online/GameShown";
import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {GamesSettingPlaywright} from "@src/dsl/janggi/components/settings/components/games-setting/playwright/GamesSettingPlaywright";

/**
 * The choice between a player's own game and the one with a friend, reached as `janggi.settings.games`: both go on at once,
 * and this says which is on the board.
 */
export class GamesSettingDsl {
  private readonly games: GamesSettingPlaywright;

  constructor(page: Page) {
    this.games = new GamesSettingPlaywright(page);
  }

  async switchTo(game: GameShown): Promise<void> {
    try {
      await this.games.switchTo(game);
    } catch (error) {
      throw new DslError(`Failed to switch the board to the ${game} game`, error);
    }
  }

  /** Taps Online, which leads to the sign-in or to playing a friend where there is no game with one yet. */
  async chooseOnline(): Promise<void> {
    try {
      await this.games.chooseOnline();
    } catch (error) {
      throw new DslError("Failed to choose Online", error);
    }
  }

  async getShown(): Promise<GameShown> {
    try {
      return await this.games.getShown();
    } catch (error) {
      throw new DslError("Failed to read which game is on the board", error);
    }
  }

  async isYourMoveWaiting(): Promise<boolean> {
    try {
      return await this.games.isYourMoveWaiting();
    } catch (error) {
      throw new DslError("Failed to read whether a move is waiting in the game with the friend", error);
    }
  }
}

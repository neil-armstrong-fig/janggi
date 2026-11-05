import {PlayerPlaquePlaywright} from "@src/dsl/janggi/components/status/components/player-plaque/playwright/PlayerPlaquePlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {PlaqueClockDsl} from "@src/dsl/janggi/components/status/components/player-plaque/components/plaque-clock/PlaqueClockDsl";
import {TakenTrayDsl} from "@src/dsl/janggi/components/status/components/player-plaque/components/taken-tray/TakenTrayDsl";
import type {Page} from "@playwright/test";

/**
 * Each army's plaque, reached as `janggi.status.plaque`: its name, its score, and who plays it — the bot, the
 * player, their rating and XP. Every method names the army it asks about.
 */
export class PlayerPlaqueDsl {
  private readonly plaque: PlayerPlaquePlaywright;

  readonly clock: PlaqueClockDsl;
  readonly takenTray: TakenTrayDsl;

  constructor(page: Page) {
    this.plaque = new PlayerPlaquePlaywright(page);

    this.clock = new PlaqueClockDsl(page);
    this.takenTray = new TakenTrayDsl(page);
  }

  /** What an army is called on its plaque. */
  async getArmyName(side: Side): Promise<string> {
    try {
      return await this.plaque.getArmyName(side);
    } catch (error) {
      throw new DslError(`Failed to read what ${side} is called`, error);
    }
  }

  /** What one army is worth in points, Han's 덤 counted in. */
  async getScore(side: Side): Promise<number> {
    try {
      return await this.plaque.getScore(side);
    } catch (error) {
      throw new DslError(`Failed to read ${side}'s score`, error);
    }
  }

  /** The score an army is shown with once it has finished rolling to its new value. */
  async getShownScore(side: Side): Promise<number> {
    try {
      return await this.plaque.getShownScore(side);
    } catch (error) {
      throw new DslError(`Failed to read the score ${side} is shown with`, error);
    }
  }

  /** Whether an army is marked as played by the bot. */
  async isMarkedAsTheBot(side: Side): Promise<boolean> {
    try {
      return await this.plaque.isMarkedAsTheBot(side);
    } catch (error) {
      throw new DslError(`Failed to read whether ${side} is marked as the bot's`, error);
    }
  }

  /** Whether an army is marked as the player's own, against the bot. */
  async isMarkedAsThePlayer(side: Side): Promise<boolean> {
    try {
      return await this.plaque.isMarkedAsThePlayer(side);
    } catch (error) {
      throw new DslError(`Failed to read whether ${side} is marked as the player's`, error);
    }
  }

  /** The rating shown beside an army — the bot's strength or the player's Elo — or undefined where none is. */
  async getShownRating(side: Side): Promise<number | undefined> {
    try {
      return await this.plaque.getShownRating(side);
    } catch (error) {
      throw new DslError(`Failed to read the rating shown beside ${side}`, error);
    }
  }

  /** The XP shown beside an army, or undefined where none is — the bot's plaque, two people, or a narrow screen. */
  async getShownXp(side: Side): Promise<number | undefined> {
    try {
      return await this.plaque.getShownXp(side);
    } catch (error) {
      throw new DslError(`Failed to read the XP shown beside ${side}`, error);
    }
  }

  /** Whether the amount and its XP unit occupy one line on an army's plaque. */
  async isXpOnOneLine(side: Side): Promise<boolean> {
    try {
      return await this.plaque.isXpOnOneLine(side);
    } catch (error) {
      throw new DslError(`Failed to read whether the XP shown beside ${side} is on one line`, error);
    }
  }

  /** The next unlock shown beside the player's XP, or undefined once everything is open. */
  async getNextUnlock(side: Side): Promise<string | undefined> {
    try {
      return await this.plaque.getNextUnlock(side);
    } catch (error) {
      throw new DslError(`Failed to read the next unlock shown beside ${side}`, error);
    }
  }
}

import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import {DslError} from "@src/dsl/errors/DslError";
import type {GamesAgainst} from "@src/dsl/janggi/components/record-sheet/playwright/RecordSheetPlaywright";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Page} from "@playwright/test";
import {RecordSheetPlaywright} from "@src/dsl/janggi/components/record-sheet/playwright/RecordSheetPlaywright";

/**
 * The player's record against the bot, reached as `janggi.recordSheet` — their rating and every game
 * behind it, kept apart for each match format.
 */
export class RecordSheetDsl {
  private readonly record: RecordSheetPlaywright;

  constructor(page: Page) {
    this.record = new RecordSheetPlaywright(page);
  }

  /** Whether the game stays on the page while the record is open over it. */
  async isGameStillBeneath(): Promise<boolean> {
    try {
      return await this.record.isGameStillBeneath();
    } catch (error) {
      throw new DslError("Failed to check whether the game stays beneath the record", error);
    }
  }

  /** Starts the record again — the rating and every game, in both formats — confirming when asked. */
  async resetRecord(): Promise<void> {
    try {
      await this.record.resetRecord();
    } catch (error) {
      throw new DslError("Failed to reset the player's record", error);
    }
  }

  /** The player's rating in one format. */
  async getElo(format: MatchFormat): Promise<number> {
    try {
      return await this.record.getElo(format);
    } catch (error) {
      throw new DslError(`Failed to read the player's ${format} rating`, error);
    }
  }

  /** How every game in one format against the bot at one strength has ended. */
  async getGamesAgainst(format: MatchFormat, elo: BotElo): Promise<GamesAgainst> {
    try {
      return await this.record.getGamesAgainst(format, elo);
    } catch (error) {
      throw new DslError(`Failed to read the ${format} record against the ${elo} bot`, error);
    }
  }
}

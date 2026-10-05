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

  /** The words on the button that opens the record, as the player reads them. */
  async getOpenerLabel(): Promise<string> {
    try {
      return await this.record.getOpenerLabel();
    } catch (error) {
      throw new DslError("Failed to read the label on the button that opens the record", error);
    }
  }

  /** What the reset button says, as the player reads it. */
  async getResetLabel(): Promise<string> {
    try {
      return await this.record.getResetLabel();
    } catch (error) {
      throw new DslError("Failed to read the label on the record's reset button", error);
    }
  }

  async openRecord(): Promise<void> {
    try {
      await this.record.openRecord();
    } catch (error) {
      throw new DslError("Failed to open the player's record", error);
    }
  }

  async goBackToSettings(): Promise<void> {
    try {
      await this.record.goBackToSettings();
    } catch (error) {
      throw new DslError("Failed to go back from the record to Settings", error);
    }
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

import type {Page} from "@playwright/test";
import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import {BotStrengthSettingPlaywright} from "@src/dsl/janggi/components/settings/components/bot-strength-setting/playwright/BotStrengthSettingPlaywright";
import {DslError} from "@src/dsl/errors/DslError";

/** The picker for how strong the bot plays, reached as `janggi.settings.botStrength`. */
export class BotStrengthSettingDsl {
  private readonly strength: BotStrengthSettingPlaywright;

  constructor(page: Page) {
    this.strength = new BotStrengthSettingPlaywright(page);
  }

  async setTo(elo: BotElo): Promise<void> {
    try {
      await this.strength.choose(elo);
    } catch (error) {
      throw new DslError(`Failed to set the bot's strength to ${elo}`, error);
    }
  }

  async getSelected(): Promise<BotElo | undefined> {
    try {
      return await this.strength.getSelected();
    } catch (error) {
      throw new DslError("Failed to read how strong the bot is set to play", error);
    }
  }

  async isChoosable(): Promise<boolean> {
    try {
      return await this.strength.isChoosable();
    } catch (error) {
      throw new DslError("Failed to check whether the bot's strength can still be chosen", error);
    }
  }

  /** Whether a strength is listed but may not be played yet, the one beneath it not having been beaten. */
  async isLocked(elo: BotElo): Promise<boolean> {
    try {
      return await this.strength.isLocked(elo);
    } catch (error) {
      throw new DslError(`Failed to read whether the ${elo} bot is locked`, error);
    }
  }
}

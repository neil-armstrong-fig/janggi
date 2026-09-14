import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import type {OpponentName} from "@janggi/shared/janggi/settings/OpponentName";
import {OpponentSettingPlaywright} from "@src/dsl/janggi/components/settings/components/opponent-setting/playwright/OpponentSettingPlaywright";

/** The picker for who plays the other army, reached as `janggi.settings.opponent`. */
export class OpponentSettingDsl {
  private readonly opponent: OpponentSettingPlaywright;

  constructor(page: Page) {
    this.opponent = new OpponentSettingPlaywright(page);
  }

  async setTo(name: OpponentName): Promise<void> {
    try {
      await this.opponent.choose(name);
    } catch (error) {
      throw new DslError(`Failed to set the opponent to "${name}"`, error);
    }
  }

  async getSelected(): Promise<OpponentName | undefined> {
    try {
      return await this.opponent.getSelected();
    } catch (error) {
      throw new DslError("Failed to read who the opponent is", error);
    }
  }

  /** Whether the opponent may still be chosen. Like the format, it is settled before play. */
  async isChoosable(): Promise<boolean> {
    try {
      return await this.opponent.isChoosable();
    } catch (error) {
      throw new DslError("Failed to check whether the opponent can still be chosen", error);
    }
  }
}

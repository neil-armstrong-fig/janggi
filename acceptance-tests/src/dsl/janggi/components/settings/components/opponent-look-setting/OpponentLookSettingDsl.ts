import type {Page} from "@playwright/test";
import {OpponentLookSettingPlaywright} from "@src/dsl/janggi/components/settings/components/opponent-look-setting/playwright/OpponentLookSettingPlaywright";
import {DslError} from "@src/dsl/errors/DslError";

/**
 * The "Show opponent's board and pieces" switch, reached as `janggi.settings.opponentLook`: whether a game against a
 * friend is drawn in the board and pieces they wear, or in the player's own.
 */
export class OpponentLookSettingDsl {
  private readonly opponentLook: OpponentLookSettingPlaywright;

  constructor(page: Page) {
    this.opponentLook = new OpponentLookSettingPlaywright(page);
  }

  async isOn(): Promise<boolean> {
    try {
      return await this.opponentLook.isOn();
    } catch (error) {
      throw new DslError("Failed to read whether the opponent's board and pieces are shown", error);
    }
  }

  async setTo(on: boolean): Promise<void> {
    try {
      await this.opponentLook.setTo(on);
    } catch (error) {
      throw new DslError(`Failed to set showing the opponent's board and pieces to ${on}`, error);
    }
  }
}

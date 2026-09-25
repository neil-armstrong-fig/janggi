import type {Page} from "@playwright/test";
import {FlipBoardSettingPlaywright} from "@src/dsl/janggi/components/settings/components/flip-board-setting/playwright/FlipBoardSettingPlaywright";
import {DslError} from "@src/dsl/errors/DslError";

/** The "Flip board for Han" check box, reached as `janggi.settings.flipBoard`. */
export class FlipBoardSettingDsl {
  private readonly flipBoard: FlipBoardSettingPlaywright;

  constructor(page: Page) {
    this.flipBoard = new FlipBoardSettingPlaywright(page);
  }

  async isOn(): Promise<boolean> {
    try {
      return await this.flipBoard.isOn();
    } catch (error) {
      throw new DslError("Failed to read whether the board is set to flip for Han", error);
    }
  }

  async setTo(on: boolean): Promise<void> {
    try {
      await this.flipBoard.setTo(on);
    } catch (error) {
      throw new DslError(`Failed to set flipping the board for Han to ${on}`, error);
    }
  }
}

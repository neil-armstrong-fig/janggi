import type {Page} from "@playwright/test";
import {FlipBoardSettingPlaywright} from "@src/dsl/janggi/components/settings/components/flip-board-setting/playwright/FlipBoardSettingPlaywright";
import {DslError} from "@src/dsl/errors/DslError";

/** The "Flip board for Han" switch, reached as `janggi.settings.flipBoard`. */
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

  /** Presses the (?) beside the switch, which unfolds what it does or folds it away again. */
  async toggleExplanation(): Promise<void> {
    try {
      await this.flipBoard.toggleExplanation();
    } catch (error) {
      throw new DslError("Failed to press the (?) beside flipping the board", error);
    }
  }

  async isExplanationShown(): Promise<boolean> {
    try {
      return await this.flipBoard.isExplanationShown();
    } catch (error) {
      throw new DslError("Failed to read whether flipping the board is explained", error);
    }
  }

  async getExplanationWords(): Promise<string> {
    try {
      return await this.flipBoard.getExplanationWords();
    } catch (error) {
      throw new DslError("Failed to read the explanation of flipping the board", error);
    }
  }
}

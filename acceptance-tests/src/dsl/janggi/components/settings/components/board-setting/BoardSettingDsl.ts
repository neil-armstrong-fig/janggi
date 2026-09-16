import type {Page} from "@playwright/test";
import {BoardSettingPlaywright} from "@src/dsl/janggi/components/settings/components/board-setting/playwright/BoardSettingPlaywright";
import type {BoardStyleName} from "@janggi/shared/janggi/settings/BoardStyleName";
import {DslError} from "@src/dsl/errors/DslError";

/** The board picker, reached as `janggi.settings.board`. */
export class BoardSettingDsl {
  private readonly board: BoardSettingPlaywright;

  constructor(page: Page) {
    this.board = new BoardSettingPlaywright(page);
  }

  async setTo(name: BoardStyleName): Promise<void> {
    try {
      await this.board.choose(name);
    } catch (error) {
      throw new DslError(`Failed to set the board to "${name}"`, error);
    }
  }

  /** Wears one of the player's own boards, which may be called anything. */
  async setOwnStyleTo(name: string): Promise<void> {
    try {
      await this.board.chooseNamed(name);
    } catch (error) {
      throw new DslError(`Failed to set the board to the player's own "${name}"`, error);
    }
  }

  async getSelected(): Promise<BoardStyleName | undefined> {
    try {
      return await this.board.getSelected();
    } catch (error) {
      throw new DslError("Failed to read which board is selected", error);
    }
  }

  /** The name of the board in use, whether a built-in or one of the player's own. */
  async getSelectedName(): Promise<string> {
    try {
      return await this.board.getSelectedName();
    } catch (error) {
      throw new DslError("Failed to read the name of the board in use", error);
    }
  }

  /** Whether a board is listed but may not be chosen yet, for want of XP. */
  async isLocked(name: BoardStyleName): Promise<boolean> {
    try {
      return await this.board.isLocked(name);
    } catch (error) {
      throw new DslError(`Failed to read whether the "${name}" board is locked`, error);
    }
  }
}

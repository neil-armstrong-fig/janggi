import type {Page} from "@playwright/test";
import {BoardSettingPlaywright} from "@src/dsl/janggi/components/settings/components/board-setting/playwright/BoardSettingPlaywright";
import type {BoardStyleName} from "@janggi/shared/janggi/settings/BoardStyleName";
import {DslError} from "@src/dsl/errors/DslError";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

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

  /** Whether Han's and Cho's boards are chosen apart, rather than one board dressing both. */
  async isChosenApart(): Promise<boolean> {
    try {
      return await this.board.isChosenApart();
    } catch (error) {
      throw new DslError("Failed to read whether the armies' boards are chosen apart", error);
    }
  }

  /** Turns choosing the armies' boards apart on, or off. */
  async toggleChoosingApart(): Promise<void> {
    try {
      await this.board.toggleChoosingApart();
    } catch (error) {
      throw new DslError("Failed to toggle choosing the armies' boards apart", error);
    }
  }

  /** Chooses one army's board — a built-in or one of the player's own — with the boards chosen apart. */
  async chooseForArmy(side: Side, name: string): Promise<void> {
    try {
      await this.board.chooseForArmy(side, name);
    } catch (error) {
      throw new DslError(`Failed to set ${side}'s board to "${name}"`, error);
    }
  }

  async getSelectedNameForArmy(side: Side): Promise<string> {
    try {
      return await this.board.getSelectedNameForArmy(side);
    } catch (error) {
      throw new DslError(`Failed to read the name of ${side}'s board`, error);
    }
  }
}

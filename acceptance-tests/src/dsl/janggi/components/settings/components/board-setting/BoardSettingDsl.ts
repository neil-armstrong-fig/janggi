import type {BoardSettingPlaywright} from "@src/dsl/janggi/components/settings/components/board-setting/playwright/BoardSettingPlaywright";
import type {BoardStyleName} from "@janggi/shared/janggi/settings/BoardStyleName";
import {DslError} from "@src/dsl/errors/DslError";

/** The board picker, reached as `janggi.settings.board`. */
export class BoardSettingDsl {
  constructor(private readonly board: BoardSettingPlaywright) {}

  async setTo(name: BoardStyleName): Promise<void> {
    try {
      await this.board.choose(name);
    } catch (error) {
      throw new DslError(`Failed to set the board to "${name}"`, error);
    }
  }

  async getSelected(): Promise<BoardStyleName | undefined> {
    try {
      return await this.board.getSelected();
    } catch (error) {
      throw new DslError("Failed to read which board is selected", error);
    }
  }
}

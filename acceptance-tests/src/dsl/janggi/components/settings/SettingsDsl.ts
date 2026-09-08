import type {BoardStyleName} from "@janggi/shared/janggi/settings/BoardStyleName";
import {DslError} from "@src/dsl/errors/DslError";
import type {PieceSetName} from "@janggi/shared/janggi/settings/PieceSetName";
import type {SettingsPlaywright} from "@src/dsl/janggi/components/settings/playwright/SettingsPlaywright";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";

/**
 * The controls under the board, reached as `janggi.settings`.
 *
 * A setting is named by the label a player reads on the button, and the names come from
 * `@janggi/shared` — so a spec says what a user would say, and asking for a style the app does not
 * ship is a compile error rather than a click that silently times out.
 *
 * `setBothSetupsTo` is the one method here that is not a single call down: the two armies arrange
 * themselves separately, and a spec that does not care about the difference should not have to say
 * so twice.
 */
export class SettingsDsl {
  constructor(private readonly settings: SettingsPlaywright) {}

  async setBoardTo(name: BoardStyleName): Promise<void> {
    try {
      await this.settings.board.choose(name);
    } catch (error) {
      throw new DslError(`Failed to set the board to "${name}"`, error);
    }
  }

  async getSelectedBoard(): Promise<BoardStyleName | undefined> {
    try {
      return await this.settings.board.getSelected();
    } catch (error) {
      throw new DslError("Failed to read which board is selected", error);
    }
  }

  async setPieceSetTo(name: PieceSetName): Promise<void> {
    try {
      await this.settings.pieceSet.choose(name);
    } catch (error) {
      throw new DslError(`Failed to set the pieces to "${name}"`, error);
    }
  }

  async getSelectedPieceSet(): Promise<PieceSetName | undefined> {
    try {
      return await this.settings.pieceSet.getSelected();
    } catch (error) {
      throw new DslError("Failed to read which piece set is selected", error);
    }
  }

  async setHanSetupTo(name: SetupName): Promise<void> {
    try {
      await this.settings.hanSetup.choose(name);
    } catch (error) {
      throw new DslError(`Failed to set Han's setup to "${name}"`, error);
    }
  }

  async getSelectedHanSetup(): Promise<SetupName | undefined> {
    try {
      return await this.settings.hanSetup.getSelected();
    } catch (error) {
      throw new DslError("Failed to read which setup Han has chosen", error);
    }
  }

  async setChoSetupTo(name: SetupName): Promise<void> {
    try {
      await this.settings.choSetup.choose(name);
    } catch (error) {
      throw new DslError(`Failed to set Cho's setup to "${name}"`, error);
    }
  }

  async getSelectedChoSetup(): Promise<SetupName | undefined> {
    try {
      return await this.settings.choSetup.getSelected();
    } catch (error) {
      throw new DslError("Failed to read which setup Cho has chosen", error);
    }
  }

  /** Both armies at once, for a spec that only cares that they match. */
  async setBothSetupsTo(name: SetupName): Promise<void> {
    await this.setHanSetupTo(name);
    await this.setChoSetupTo(name);
  }
}

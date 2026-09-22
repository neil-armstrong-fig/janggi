import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {PieceSetName} from "@janggi/shared/janggi/settings/PieceSetName";
import {PieceSetSettingPlaywright} from "@src/dsl/janggi/components/settings/components/piece-set-setting/playwright/PieceSetSettingPlaywright";

/** The piece-set picker, reached as `janggi.settings.pieceSet`. */
export class PieceSetSettingDsl {
  private readonly pieceSet: PieceSetSettingPlaywright;

  constructor(page: Page) {
    this.pieceSet = new PieceSetSettingPlaywright(page);
  }

  async setTo(name: PieceSetName): Promise<void> {
    try {
      await this.pieceSet.choose(name);
    } catch (error) {
      throw new DslError(`Failed to set the pieces to "${name}"`, error);
    }
  }

  /** Wears one of the player's own piece sets, which may be called anything. */
  async setOwnStyleTo(name: string): Promise<void> {
    try {
      await this.pieceSet.chooseNamed(name);
    } catch (error) {
      throw new DslError(`Failed to set the pieces to the player's own "${name}"`, error);
    }
  }

  async getSelected(): Promise<PieceSetName | undefined> {
    try {
      return await this.pieceSet.getSelected();
    } catch (error) {
      throw new DslError("Failed to read which piece set is selected", error);
    }
  }

  /** The name of the piece set in use, whether a built-in or one of the player's own. */
  async getSelectedName(): Promise<string> {
    try {
      return await this.pieceSet.getSelectedName();
    } catch (error) {
      throw new DslError("Failed to read the name of the piece set in use", error);
    }
  }

  /** The built-in piece sets in the order the picker offers them. */
  async getBuiltInOrder(): Promise<PieceSetName[]> {
    try {
      return await this.pieceSet.getBuiltInOrder();
    } catch (error) {
      throw new DslError("Failed to read the order of the built-in piece sets", error);
    }
  }

  /** Whether a piece set is listed but may not be chosen yet, for want of XP. */
  async isLocked(name: PieceSetName): Promise<boolean> {
    try {
      return await this.pieceSet.isLocked(name);
    } catch (error) {
      throw new DslError(`Failed to read whether the "${name}" pieces are locked`, error);
    }
  }

  /** Whether Han's and Cho's pieces are chosen apart, rather than one set dressing both. */
  async isChosenApart(): Promise<boolean> {
    try {
      return await this.pieceSet.isChosenApart();
    } catch (error) {
      throw new DslError("Failed to read whether the armies' pieces are chosen apart", error);
    }
  }

  /** Turns choosing the armies' pieces apart on, or off. */
  async toggleChoosingApart(): Promise<void> {
    try {
      await this.pieceSet.toggleChoosingApart();
    } catch (error) {
      throw new DslError("Failed to toggle choosing the armies' pieces apart", error);
    }
  }

  /** Chooses one army's pieces — a built-in or one of the player's own — with the armies chosen apart. */
  async chooseForArmy(side: Side, name: string): Promise<void> {
    try {
      await this.pieceSet.chooseForArmy(side, name);
    } catch (error) {
      throw new DslError(`Failed to set ${side}'s pieces to "${name}"`, error);
    }
  }

  async getSelectedNameForArmy(side: Side): Promise<string> {
    try {
      return await this.pieceSet.getSelectedNameForArmy(side);
    } catch (error) {
      throw new DslError(`Failed to read the name of ${side}'s pieces`, error);
    }
  }
}

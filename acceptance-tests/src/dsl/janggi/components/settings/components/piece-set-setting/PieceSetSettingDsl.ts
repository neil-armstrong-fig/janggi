import {DslError} from "@src/dsl/errors/DslError";
import type {PieceSetName} from "@janggi/shared/janggi/settings/PieceSetName";
import type {PieceSetSettingPlaywright} from "@src/dsl/janggi/components/settings/components/piece-set-setting/playwright/PieceSetSettingPlaywright";

/** The piece-set picker, reached as `janggi.settings.pieceSet`. */
export class PieceSetSettingDsl {
  constructor(private readonly pieceSet: PieceSetSettingPlaywright) {}

  async setTo(name: PieceSetName): Promise<void> {
    try {
      await this.pieceSet.choose(name);
    } catch (error) {
      throw new DslError(`Failed to set the pieces to "${name}"`, error);
    }
  }

  async getSelected(): Promise<PieceSetName | undefined> {
    try {
      return await this.pieceSet.getSelected();
    } catch (error) {
      throw new DslError("Failed to read which piece set is selected", error);
    }
  }
}

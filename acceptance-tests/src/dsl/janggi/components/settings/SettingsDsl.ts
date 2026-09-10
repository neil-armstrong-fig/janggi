import {BoardSettingDsl} from "@src/dsl/janggi/components/settings/components/board-setting/BoardSettingDsl";
import {ChoSetupSettingDsl} from "@src/dsl/janggi/components/settings/components/cho-setup-setting/ChoSetupSettingDsl";
import {DslError} from "@src/dsl/errors/DslError";
import {HanSetupSettingDsl} from "@src/dsl/janggi/components/settings/components/han-setup-setting/HanSetupSettingDsl";
import {MatchFormatSettingDsl} from "@src/dsl/janggi/components/settings/components/match-format-setting/MatchFormatSettingDsl";
import {MovableHighlightSettingDsl} from "@src/dsl/janggi/components/settings/components/movable-highlight-setting/MovableHighlightSettingDsl";
import {PieceSetSettingDsl} from "@src/dsl/janggi/components/settings/components/piece-set-setting/PieceSetSettingDsl";
import {SettingsPlaywright} from "@src/dsl/janggi/components/settings/playwright/SettingsPlaywright";
import type {Page} from "@playwright/test";
import type {ElephantPairing} from "@janggi/shared/janggi/settings/ElephantPairing";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";

/**
 * The controls under the board, reached as `janggi.settings`.
 *
 * One member per setting, so a spec says which control it means before it says what to do with it —
 * `janggi.settings.board.setTo("Neon")`. Each member is its own DSL beside its own `*Playwright`,
 * which is what keeps a picker's methods, its error messages and its test ids in one place instead
 * of spread across a class that grows by two methods every time a setting is added.
 *
 * A setting is named by the label a player reads on the button, and the names come from
 * `@janggi/shared` — so a spec says what a user would say, and asking for a style the app does not
 * ship is a compile error rather than a click that silently times out.
 *
 * What is left here is only what belongs to no single picker: the two methods below each reach
 * across both armies' setups.
 */
export class SettingsDsl {
  private readonly settings: SettingsPlaywright;

  readonly board: BoardSettingDsl;
  readonly pieceSet: PieceSetSettingDsl;
  readonly hanSetup: HanSetupSettingDsl;
  readonly choSetup: ChoSetupSettingDsl;
  readonly movableHighlight: MovableHighlightSettingDsl;
  readonly matchFormat: MatchFormatSettingDsl;

  constructor(page: Page) {
    this.settings = new SettingsPlaywright(page);

    this.board = new BoardSettingDsl(page);
    this.pieceSet = new PieceSetSettingDsl(page);
    this.hanSetup = new HanSetupSettingDsl(page);
    this.choSetup = new ChoSetupSettingDsl(page);
    this.movableHighlight = new MovableHighlightSettingDsl(page);
    this.matchFormat = new MatchFormatSettingDsl(page);
  }

  /** Both armies at once, for a spec that only cares that they match. */
  async setBothSetupsTo(name: SetupName): Promise<void> {
    await this.hanSetup.setTo(name);
    await this.choSetup.setTo(name);
  }

  /**
   * Whether either army's arrangement may still be changed. A back rank is set before play.
   *
   * Asks both pickers rather than one. They lock together on the same move count, so asking one
   * would pass just as happily if the other had been left live.
   */
  async canChooseSetups(): Promise<boolean> {
    try {
      return (await this.hanSetup.isChoosable()) && (await this.choSetup.isChoosable());
    } catch (error) {
      throw new DslError("Failed to check whether the setups can still be chosen", error);
    }
  }

  /**
   * Whether the two arrangements have come to 맞상 or 엇상, or to neither — the classification that
   * falls out of both choices rather than out of either one, which is why it is here.
   */
  /** Whether the pairing line is shown at all — it is absent where there is no pairing to name. */
  async isElephantPairingShown(): Promise<boolean> {
    try {
      return await this.settings.isElephantPairingShown();
    } catch (error) {
      throw new DslError("Failed to check whether the pairing line is shown", error);
    }
  }

  async getElephantPairing(): Promise<ElephantPairing | undefined> {
    try {
      return await this.settings.getElephantPairing();
    } catch (error) {
      throw new DslError("Failed to read how the two arrangements pair up", error);
    }
  }
}

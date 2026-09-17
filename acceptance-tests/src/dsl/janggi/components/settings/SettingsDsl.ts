import {BoardSettingDsl} from "@src/dsl/janggi/components/settings/components/board-setting/BoardSettingDsl";
import {BotStrengthSettingDsl} from "@src/dsl/janggi/components/settings/components/bot-strength-setting/BotStrengthSettingDsl";
import {ChoSetupSettingDsl} from "@src/dsl/janggi/components/settings/components/cho-setup-setting/ChoSetupSettingDsl";
import {DslError} from "@src/dsl/errors/DslError";
import {EffectsSettingDsl} from "@src/dsl/janggi/components/settings/components/effects-setting/EffectsSettingDsl";
import {HanSetupSettingDsl} from "@src/dsl/janggi/components/settings/components/han-setup-setting/HanSetupSettingDsl";
import {InstallButtonDsl} from "@src/dsl/janggi/components/settings/components/install-button/InstallButtonDsl";
import {MatchFormatSettingDsl} from "@src/dsl/janggi/components/settings/components/match-format-setting/MatchFormatSettingDsl";
import {MovableHighlightSettingDsl} from "@src/dsl/janggi/components/settings/components/movable-highlight-setting/MovableHighlightSettingDsl";
import {MusicSettingDsl} from "@src/dsl/janggi/components/settings/components/music-setting/MusicSettingDsl";
import {OpponentSettingDsl} from "@src/dsl/janggi/components/settings/components/opponent-setting/OpponentSettingDsl";
import {SoundEffectsSettingDsl} from "@src/dsl/janggi/components/settings/components/sound-effects-setting/SoundEffectsSettingDsl";
import {PieceSetSettingDsl} from "@src/dsl/janggi/components/settings/components/piece-set-setting/PieceSetSettingDsl";
import {ProgressSettingDsl} from "@src/dsl/janggi/components/settings/components/progress-setting/ProgressSettingDsl";
import {SettingsPlaywright} from "@src/dsl/janggi/components/settings/playwright/SettingsPlaywright";
import type {Page} from "@playwright/test";
import type {ElephantPairing} from "@janggi/shared/janggi/settings/ElephantPairing";
import type {SettingsSectionName} from "@janggi/shared/janggi/settings/SettingsSectionName";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import {YourSideSettingDsl} from "@src/dsl/janggi/components/settings/components/your-side-setting/YourSideSettingDsl";

/**
 * The settings sheet, reached as `janggi.settings`.
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
 * What is left here is only what belongs to no single picker: two methods that reach across both
 * armies' setups, the pairing line those two choices produce, and New game, which deals from them.
 *
 * None of it asks a spec to open the sheet first. Every action opens it and shuts it again itself —
 * see `SettingsSheetComponent` — so choosing a setting reads the same as it did before there was one.
 */
export class SettingsDsl {
  private readonly settings: SettingsPlaywright;

  readonly board: BoardSettingDsl;
  readonly pieceSet: PieceSetSettingDsl;
  readonly hanSetup: HanSetupSettingDsl;
  readonly choSetup: ChoSetupSettingDsl;
  readonly movableHighlight: MovableHighlightSettingDsl;
  readonly matchFormat: MatchFormatSettingDsl;
  readonly opponent: OpponentSettingDsl;
  readonly botStrength: BotStrengthSettingDsl;
  readonly yourSide: YourSideSettingDsl;
  readonly effects: EffectsSettingDsl;
  readonly soundEffects: SoundEffectsSettingDsl;
  readonly music: MusicSettingDsl;
  readonly progress: ProgressSettingDsl;
  readonly install: InstallButtonDsl;

  constructor(page: Page) {
    this.settings = new SettingsPlaywright(page);

    this.board = new BoardSettingDsl(page);
    this.pieceSet = new PieceSetSettingDsl(page);
    this.hanSetup = new HanSetupSettingDsl(page);
    this.choSetup = new ChoSetupSettingDsl(page);
    this.movableHighlight = new MovableHighlightSettingDsl(page);
    this.matchFormat = new MatchFormatSettingDsl(page);
    this.opponent = new OpponentSettingDsl(page);
    this.botStrength = new BotStrengthSettingDsl(page);
    this.yourSide = new YourSideSettingDsl(page);
    this.effects = new EffectsSettingDsl(page);
    this.soundEffects = new SoundEffectsSettingDsl(page);
    this.music = new MusicSettingDsl(page);
    this.progress = new ProgressSettingDsl(page);
    this.install = new InstallButtonDsl(page);
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

  async isGuideLinkedFromGame(): Promise<boolean> {
    try {
      return await this.settings.isGuideLinkedFromGame();
    } catch (error) {
      throw new DslError("Failed to check whether the Janggi guide is linked from the game", error);
    }
  }

  /** Whether a section of the sheet has its settings folded away under its heading. */
  async isSectionFolded(name: SettingsSectionName): Promise<boolean> {
    try {
      return await this.settings.isSectionFolded(name);
    } catch (error) {
      throw new DslError(`Failed to read whether the "${name}" settings are folded away`, error);
    }
  }

  /** Folds a section of the sheet away under its heading. */
  async foldSection(name: SettingsSectionName): Promise<void> {
    try {
      await this.settings.foldSection(name);
    } catch (error) {
      throw new DslError(`Failed to fold the "${name}" settings away`, error);
    }
  }

  /** Unfolds a section of the sheet, laying its settings out under its heading. */
  async unfoldSection(name: SettingsSectionName): Promise<void> {
    try {
      await this.settings.unfoldSection(name);
    } catch (error) {
      throw new DslError(`Failed to unfold the "${name}" settings`, error);
    }
  }

  /** Deals a fresh game from the format and setups chosen, abandoning whatever was being played. */
  async startNewGame(): Promise<void> {
    try {
      await this.settings.startNewGame();
    } catch (error) {
      throw new DslError("Failed to start a new game", error);
    }
  }
}

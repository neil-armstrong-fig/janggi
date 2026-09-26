import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {ProgressSettingPlaywright} from "@src/dsl/janggi/components/settings/components/progress-setting/playwright/ProgressSettingPlaywright";

/** The player's progress and the saves that carry it, reached as `janggi.settings.progress`. */
export class ProgressSettingDsl {
  private readonly progress: ProgressSettingPlaywright;

  constructor(page: Page) {
    this.progress = new ProgressSettingPlaywright(page);
  }

  /** Pastes a save key into the box and loads it, as a player moving device would. */
  async loadSave(key: string): Promise<void> {
    try {
      await this.progress.loadSave(key);
    } catch (error) {
      throw new DslError("Failed to load a save", error);
    }
  }

  /** Starts the tour again from its first step, from where the Progress tab offers it. */
  async replayTheTour(): Promise<void> {
    try {
      await this.progress.replayTheTour();
    } catch (error) {
      throw new DslError("Failed to replay the tour from the Progress tab", error);
    }
  }

  async getXp(): Promise<number> {
    try {
      return await this.progress.getXp();
    } catch (error) {
      throw new DslError("Failed to read the player's XP", error);
    }
  }

  /** How far the XP bar is filled, in whole percent, or undefined where none is drawn. */
  async getXpBarPercent(): Promise<number | undefined> {
    try {
      return await this.progress.getXpBarPercent();
    } catch (error) {
      throw new DslError("Failed to read how full the XP bar is", error);
    }
  }

  async getNextUnlockXp(): Promise<number | undefined> {
    try {
      return await this.progress.getNextUnlockXp();
    } catch (error) {
      throw new DslError("Failed to read how much XP the next unlock needs", error);
    }
  }

  /** The save key the player would copy, pressing Copy to see it. */
  async getSaveKey(): Promise<string> {
    try {
      return await this.progress.getSaveKey();
    } catch (error) {
      throw new DslError("Failed to read the player's save key", error);
    }
  }

  /** Whether the last text loaded was refused as not being a save key. */
  async isSaveRefused(): Promise<boolean> {
    try {
      return await this.progress.isSaveRefused();
    } catch (error) {
      throw new DslError("Failed to read whether the save was refused", error);
    }
  }
}

import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import {MatchFormatSettingPlaywright} from "@src/dsl/janggi/components/settings/components/match-format-setting/playwright/MatchFormatSettingPlaywright";

/** The picker for which game is being played, reached as `janggi.settings.matchFormat`. */
export class MatchFormatSettingDsl {
  private readonly matchFormat: MatchFormatSettingPlaywright;

  constructor(page: Page) {
    this.matchFormat = new MatchFormatSettingPlaywright(page);
  }

  async setTo(name: MatchFormat): Promise<void> {
    try {
      await this.matchFormat.choose(name);
    } catch (error) {
      throw new DslError(`Failed to set the match format to "${name}"`, error);
    }
  }

  async getSelected(): Promise<MatchFormat | undefined> {
    try {
      return await this.matchFormat.getSelected();
    } catch (error) {
      throw new DslError("Failed to read which match format is being played", error);
    }
  }

  /** Asks what the two formats are, or folds the answer away again if it is already shown. */
  async toggleExplanation(): Promise<void> {
    try {
      await this.matchFormat.toggleExplanation();
    } catch (error) {
      throw new DslError("Failed to toggle the explanation of the match formats", error);
    }
  }

  async isExplanationShown(): Promise<boolean> {
    try {
      return await this.matchFormat.isExplanationShown();
    } catch (error) {
      throw new DslError("Failed to check whether the match formats are explained", error);
    }
  }

  /** Whether the format may still be chosen. It is a rule of the match, settled before play. */
  async isChoosable(): Promise<boolean> {
    try {
      return await this.matchFormat.isChoosable();
    } catch (error) {
      throw new DslError("Failed to check whether the match format can still be chosen", error);
    }
  }
}

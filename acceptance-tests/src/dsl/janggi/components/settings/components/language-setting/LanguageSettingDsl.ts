import {DslError} from "@src/dsl/errors/DslError";
import {LanguageSettingPlaywright} from "@src/dsl/janggi/components/settings/components/language-setting/playwright/LanguageSettingPlaywright";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import type {Page} from "@playwright/test";

/** The picker for the language the game is read in, reached as `janggi.settings.language`. */
export class LanguageSettingDsl {
  private readonly language: LanguageSettingPlaywright;

  constructor(page: Page) {
    this.language = new LanguageSettingPlaywright(page);
  }

  async setTo(name: LanguageName): Promise<void> {
    try {
      await this.language.choose(name);
    } catch (error) {
      throw new DslError(`Failed to set the language to "${name}"`, error);
    }
  }

  async getSelected(): Promise<LanguageName | undefined> {
    try {
      return await this.language.getSelected();
    } catch (error) {
      throw new DslError("Failed to read which language is chosen", error);
    }
  }
}

import {DslError} from "@src/dsl/errors/DslError";
import {LanguageSwitchPlaywright} from "@src/dsl/janggi/components/language-switch/playwright/LanguageSwitchPlaywright";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import type {Page} from "@playwright/test";

export class LanguageSwitchDsl {
  private readonly languageSwitch: LanguageSwitchPlaywright;

  constructor(page: Page) {
    this.languageSwitch = new LanguageSwitchPlaywright(page);
  }

  async getNames(): Promise<Readonly<Record<LanguageName, string>>> {
    try {
      return await this.languageSwitch.getNames();
    } catch (error) {
      throw new DslError("Failed to read what the language switch calls each language", error);
    }
  }

  async getSelection(): Promise<LanguageName | undefined> {
    try {
      return await this.languageSwitch.getSelection();
    } catch (error) {
      throw new DslError("Failed to read which language the language switch marks", error);
    }
  }

  async isTextSelectable(): Promise<boolean> {
    try {
      return await this.languageSwitch.isTextSelectable();
    } catch (error) {
      throw new DslError("Failed to check whether the language switch's words can be selected", error);
    }
  }

  /** Presses a language's name, whichever the page is in: the switch is one toggle, so either leads to the other. */
  async press(language: LanguageName): Promise<void> {
    try {
      await this.languageSwitch.press(language);
    } catch (error) {
      throw new DslError(`Failed to press "${language}" on the language switch`, error);
    }
  }

  async switchTo(language: LanguageName): Promise<void> {
    try {
      await this.languageSwitch.switchTo(language);
    } catch (error) {
      throw new DslError(`Failed to switch the page to "${language}"`, error);
    }
  }
}

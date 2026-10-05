import {DslError} from "@src/dsl/errors/DslError";
import {LanguageNoticePlaywright} from "@src/dsl/janggi/components/language-notice/playwright/LanguageNoticePlaywright";
import type {Page} from "@playwright/test";

/** The note that the Korean is a work in progress, reached as `janggi.languageNotice`. */
export class LanguageNoticeDsl {
  private readonly languageNotice: LanguageNoticePlaywright;

  constructor(page: Page) {
    this.languageNotice = new LanguageNoticePlaywright(page);
  }

  async isShown(): Promise<boolean> {
    try {
      return await this.languageNotice.isShown();
    } catch (error) {
      throw new DslError("Failed to read whether the language note is up", error);
    }
  }

  /** What the note says, in both languages. */
  async getWords(): Promise<string> {
    try {
      return await this.languageNotice.getWords();
    } catch (error) {
      throw new DslError("Failed to read the language note", error);
    }
  }

  async dismissIt(): Promise<void> {
    try {
      await this.languageNotice.dismissIt();
    } catch (error) {
      throw new DslError("Failed to dismiss the language note", error);
    }
  }
}

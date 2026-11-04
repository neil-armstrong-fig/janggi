import {DslError} from "@src/dsl/errors/DslError";
import {LanguageSwitchDsl} from "@src/dsl/janggi/components/language-switch/LanguageSwitchDsl";
import type {Page} from "@playwright/test";
import {ReferencesPlaywright} from "@src/dsl/janggi/components/references/playwright/ReferencesPlaywright";

export class ReferencesDsl {
  private readonly references: ReferencesPlaywright;

  readonly languageSwitch: LanguageSwitchDsl;

  constructor(page: Page) {
    this.references = new ReferencesPlaywright(page);

    this.languageSwitch = new LanguageSwitchDsl(page);
  }

  async openReferences(): Promise<void> {
    try {
      await this.references.openReferences();
    } catch (error) {
      throw new DslError("Failed to open references from Settings in another tab", error);
    }
  }

  async visitReferences(): Promise<void> {
    try {
      await this.references.visitReferences();
    } catch (error) {
      throw new DslError("Failed to visit the references address directly", error);
    }
  }

  async visitKoreanReferences(): Promise<void> {
    try {
      await this.references.visitKoreanReferences();
    } catch (error) {
      throw new DslError("Failed to visit the references' Korean page directly", error);
    }
  }

  async reload(): Promise<void> {
    try {
      await this.references.reload();
    } catch (error) {
      throw new DslError("Failed to reload the references page", error);
    }
  }

  async followToolsWithKeyboard(): Promise<void> {
    try {
      await this.references.followToolsWithKeyboard();
    } catch (error) {
      throw new DslError("Failed to reach the tools credits with the keyboard", error);
    }
  }

  async isLanguageSwitchAtTheTopRight(): Promise<boolean> {
    try {
      return await this.references.isLanguageSwitchAtTheTopRight();
    } catch (error) {
      throw new DslError("Failed to check where the references' language switch sits", error);
    }
  }

  async isSeparateFromGame(): Promise<boolean> {
    try {
      return await this.references.isSeparateFromGame();
    } catch (error) {
      throw new DslError("Failed to check that references leave the game in its own tab", error);
    }
  }

  async getPageTitle(): Promise<string> {
    try {
      return await this.references.getPageTitle();
    } catch (error) {
      throw new DslError("Failed to read the title of the references page", error);
    }
  }

  async getMainHeading(): Promise<string> {
    try {
      return await this.references.getMainHeading();
    } catch (error) {
      throw new DslError("Failed to read the main heading of the references page", error);
    }
  }

  async getTranslationNotice(): Promise<string> {
    try {
      return await this.references.getTranslationNotice();
    } catch (error) {
      throw new DslError("Failed to read the references' machine translation notice", error);
    }
  }

  async getOriginalAddress(): Promise<string> {
    try {
      return await this.references.getOriginalAddress();
    } catch (error) {
      throw new DslError("Failed to read where the notice's link to the English references goes", error);
    }
  }

  async getHeadings(): Promise<string[]> {
    try {
      return await this.references.getHeadings();
    } catch (error) {
      throw new DslError("Failed to read the reference sections", error);
    }
  }

  async getContent(): Promise<string> {
    try {
      return await this.references.getContent();
    } catch (error) {
      throw new DslError("Failed to read the acknowledgements", error);
    }
  }

  async getDestinationOf(id: string): Promise<string> {
    try {
      return await this.references.getDestinationOf(id);
    } catch (error) {
      throw new DslError(`Failed to read the destination of ${id}`, error);
    }
  }

  async isToolsHeadingOnScreen(): Promise<boolean> {
    try {
      return await this.references.isToolsHeadingOnScreen();
    } catch (error) {
      throw new DslError("Failed to check that the tools credits are on screen", error);
    }
  }

  async isFullyOnScreen(): Promise<boolean> {
    try {
      return await this.references.isFullyOnScreen();
    } catch (error) {
      throw new DslError("Failed to check that references fit the window", error);
    }
  }
}

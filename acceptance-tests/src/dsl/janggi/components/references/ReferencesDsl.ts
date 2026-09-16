import {DslError} from "@src/dsl/errors/DslError";
import type {Page} from "@playwright/test";
import {ReferencesPlaywright} from "@src/dsl/janggi/components/references/playwright/ReferencesPlaywright";

export class ReferencesDsl {
  private readonly references: ReferencesPlaywright;

  constructor(page: Page) {
    this.references = new ReferencesPlaywright(page);
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

  async isSeparateFromGame(): Promise<boolean> {
    try {
      return await this.references.isSeparateFromGame();
    } catch (error) {
      throw new DslError("Failed to check that references leave the game in its own tab", error);
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

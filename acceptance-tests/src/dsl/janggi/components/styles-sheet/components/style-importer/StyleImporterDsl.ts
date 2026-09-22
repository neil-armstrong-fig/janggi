import {DslError} from "@src/dsl/errors/DslError";
import type {Page} from "@playwright/test";
import {StyleImporterPlaywright} from "@src/dsl/janggi/components/styles-sheet/components/style-importer/playwright/StyleImporterPlaywright";

/**
 * The box to import a style somebody shared, reached as `janggi.stylesSheet.styleImporter` — pasting a
 * board or piece set key adds it to the player's own, at no cost, whatever their XP.
 */
export class StyleImporterDsl {
  private readonly styleImporter: StyleImporterPlaywright;

  constructor(page: Page) {
    this.styleImporter = new StyleImporterPlaywright(page);
  }

  /** Pastes a board or piece set key into the import box and imports it. */
  async importStyle(key: string): Promise<void> {
    try {
      await this.styleImporter.importStyle(key);
    } catch (error) {
      throw new DslError("Failed to import a style", error);
    }
  }

  async isRefused(): Promise<boolean> {
    try {
      return await this.styleImporter.isRefused();
    } catch (error) {
      throw new DslError("Failed to read whether the style was refused", error);
    }
  }

  /** What the player was told about the last style they imported. */
  async getMessage(): Promise<string> {
    try {
      return await this.styleImporter.getMessage();
    } catch (error) {
      throw new DslError("Failed to read what the player was told about the import", error);
    }
  }
}

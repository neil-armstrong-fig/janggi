import {DslError} from "@src/dsl/errors/DslError";
import type {Page} from "@playwright/test";
import type {StyleKind} from "@janggi/shared/janggi/settings/StyleKind";
import {StylesSheetPlaywright} from "@src/dsl/janggi/components/styles-sheet/playwright/StylesSheetPlaywright";

/**
 * The player's own board styles and piece sets, reached as `janggi.stylesSheet` — importing a style
 * somebody shared, sharing one back, deleting one, and making one of their own.
 */
export class StylesSheetDsl {
  private readonly styles: StylesSheetPlaywright;

  constructor(page: Page) {
    this.styles = new StylesSheetPlaywright(page);
  }

  /** Pastes a board or piece set key into the import box and imports it. */
  async importStyle(key: string): Promise<void> {
    try {
      await this.styles.importStyle(key);
    } catch (error) {
      throw new DslError("Failed to import a style", error);
    }
  }

  async isImportRefused(): Promise<boolean> {
    try {
      return await this.styles.isImportRefused();
    } catch (error) {
      throw new DslError("Failed to read whether the style was refused", error);
    }
  }

  /** What the player was told about the last style they imported. */
  async getImportMessage(): Promise<string> {
    try {
      return await this.styles.getImportMessage();
    } catch (error) {
      throw new DslError("Failed to read what the player was told about the import", error);
    }
  }

  async getOwnStyleNames(kind: StyleKind): Promise<readonly string[]> {
    try {
      return await this.styles.getOwnStyleNames(kind);
    } catch (error) {
      throw new DslError(`Failed to read the player's own ${kind.toLowerCase()} styles`, error);
    }
  }

  /** The key the player would copy to share one of their own styles. */
  async getStyleKey(kind: StyleKind, name: string): Promise<string> {
    try {
      return await this.styles.getStyleKey(kind, name);
    } catch (error) {
      throw new DslError(`Failed to read the key for "${name}"`, error);
    }
  }

  async deleteStyle(kind: StyleKind, name: string): Promise<void> {
    try {
      await this.styles.deleteStyle(kind, name);
    } catch (error) {
      throw new DslError(`Failed to delete "${name}"`, error);
    }
  }

  async canMakeStyles(): Promise<boolean> {
    try {
      return await this.styles.canMakeStyles();
    } catch (error) {
      throw new DslError("Failed to check whether the player may make a style", error);
    }
  }

  /**
   * Makes a style in the editor, starting from one the player has, under `name` — with the JSON as the
   * editor fills it in, or replaced by `json` where one is given.
   */
  async makeStyle(kind: StyleKind, from: string, name: string, json?: string): Promise<void> {
    try {
      await this.styles.makeStyle(kind, from, name, json);
    } catch (error) {
      throw new DslError(`Failed to make the style "${name}"`, error);
    }
  }

  /** Whether the editor refused the last style saved in it. */
  async isEditorRefused(): Promise<boolean> {
    try {
      return await this.styles.isEditorRefused();
    } catch (error) {
      throw new DslError("Failed to read whether the editor refused the style", error);
    }
  }
}

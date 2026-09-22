import {DslError} from "@src/dsl/errors/DslError";
import {OwnStylesPlaywright} from "@src/dsl/janggi/components/styles-sheet/components/own-styles/playwright/OwnStylesPlaywright";
import type {Page} from "@playwright/test";
import type {StyleKind} from "@janggi/shared/janggi/settings/StyleKind";

/** The player's own board styles and piece sets, reached as `janggi.stylesSheet.ownStyles`. */
export class OwnStylesDsl {
  private readonly ownStyles: OwnStylesPlaywright;

  constructor(page: Page) {
    this.ownStyles = new OwnStylesPlaywright(page);
  }

  async getNames(kind: StyleKind): Promise<readonly string[]> {
    try {
      return await this.ownStyles.getNames(kind);
    } catch (error) {
      throw new DslError(`Failed to read the player's own ${kind.toLowerCase()} styles`, error);
    }
  }

  /** The key the player would copy to share one of their own styles. */
  async getKey(kind: StyleKind, name: string): Promise<string> {
    try {
      return await this.ownStyles.getKey(kind, name);
    } catch (error) {
      throw new DslError(`Failed to read the key for "${name}"`, error);
    }
  }

  async delete(kind: StyleKind, name: string): Promise<void> {
    try {
      await this.ownStyles.delete(kind, name);
    } catch (error) {
      throw new DslError(`Failed to delete "${name}"`, error);
    }
  }
}

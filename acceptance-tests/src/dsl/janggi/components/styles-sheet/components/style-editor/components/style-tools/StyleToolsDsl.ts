import {DslError} from "@src/dsl/errors/DslError";
import type {Page} from "@playwright/test";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {StyleToolsPlaywright} from "@src/dsl/janggi/components/styles-sheet/components/style-editor/components/style-tools/playwright/StyleToolsPlaywright";

/**
 * The ways to start a style being made over without leaving the editor, reached as
 * `janggi.stylesSheet.styleEditor.tools` — put back what it was opened on, load another style the player
 * has, or paste a key somebody shared.
 */
export class StyleToolsDsl {
  private readonly styleTools: StyleToolsPlaywright;

  constructor(page: Page) {
    this.styleTools = new StyleToolsPlaywright(page);
  }

  /** Puts back the style being made as it was started, discarding every change since. */
  async reset(): Promise<void> {
    try {
      await this.styleTools.reset();
    } catch (error) {
      throw new DslError("Failed to reset the style", error);
    }
  }

  /** Loads a style the player has into the one being made — a whole set, or one army's pieces of it. */
  async loadFrom(name: string, scope: Side | "both"): Promise<void> {
    try {
      await this.styleTools.loadFrom(name, scope);
    } catch (error) {
      throw new DslError(`Failed to load "${name}" into the style`, error);
    }
  }

  /** Pastes a key into the editor, to load the style in it in place of the one being made. */
  async loadKey(key: string): Promise<void> {
    try {
      await this.styleTools.loadKey(key);
    } catch (error) {
      throw new DslError("Failed to load a key into the style", error);
    }
  }

  /** Whether the editor refused the last key pasted into it. */
  async isLoadRefused(): Promise<boolean> {
    try {
      return await this.styleTools.isLoadRefused();
    } catch (error) {
      throw new DslError("Failed to read whether the key was refused", error);
    }
  }
}

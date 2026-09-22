import {DslError} from "@src/dsl/errors/DslError";
import type {Page} from "@playwright/test";
import type {StyleKind} from "@janggi/shared/janggi/settings/StyleKind";
import {StyleStarterPlaywright} from "@src/dsl/janggi/components/styles-sheet/components/style-starter/playwright/StyleStarterPlaywright";

/**
 * Where making a style of one's own begins, reached as `janggi.stylesSheet.styleStarter` — once XP has
 * unlocked it, picking a kind and a style already had to start from opens the editor on it.
 */
export class StyleStarterDsl {
  private readonly styleStarter: StyleStarterPlaywright;

  constructor(page: Page) {
    this.styleStarter = new StyleStarterPlaywright(page);
  }

  async canMakeStyles(): Promise<boolean> {
    try {
      return await this.styleStarter.canMakeStyles();
    } catch (error) {
      throw new DslError("Failed to check whether the player may make a style", error);
    }
  }

  /** Starts a style in the editor from one the player has, to be changed a step at a time. */
  async start(styleKind: StyleKind, from: string): Promise<void> {
    try {
      await this.styleStarter.start(styleKind, from);
    } catch (error) {
      throw new DslError(`Failed to start a ${styleKind.toLowerCase()} style from "${from}"`, error);
    }
  }
}

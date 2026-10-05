import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import type {MovableHighlightName} from "@janggi/shared/janggi/settings/MovableHighlightName";
import {MovableHighlightSettingPlaywright} from "@src/dsl/janggi/components/settings/components/movable-highlight-setting/playwright/MovableHighlightSettingPlaywright";

/** The picker for marking the pieces that can move, reached as `janggi.settings.movableHighlight`. */
export class MovableHighlightSettingDsl {
  private readonly movableHighlight: MovableHighlightSettingPlaywright;

  constructor(page: Page) {
    this.movableHighlight = new MovableHighlightSettingPlaywright(page);
  }

  async setTo(name: MovableHighlightName): Promise<void> {
    try {
      await this.movableHighlight.choose(name);
    } catch (error) {
      throw new DslError(`Failed to set the movable-piece highlight to "${name}"`, error);
    }
  }

  /** The words beside the switch, as the player reads them. */
  async getLabel(): Promise<string> {
    try {
      return await this.movableHighlight.getLabel();
    } catch (error) {
      throw new DslError("Failed to read the words beside the movable-piece switch", error);
    }
  }

  async getSelected(): Promise<MovableHighlightName | undefined> {
    try {
      return await this.movableHighlight.getSelected();
    } catch (error) {
      throw new DslError("Failed to read whether the movable pieces are highlighted", error);
    }
  }
}

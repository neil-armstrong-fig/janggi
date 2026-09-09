import {DslError} from "@src/dsl/errors/DslError";
import type {MovableHighlightName} from "@janggi/shared/janggi/settings/MovableHighlightName";
import type {MovableHighlightSettingPlaywright} from "@src/dsl/janggi/components/settings/components/movable-highlight-setting/playwright/MovableHighlightSettingPlaywright";

/** The picker for marking the pieces that can move, reached as `janggi.settings.movableHighlight`. */
export class MovableHighlightSettingDsl {
  constructor(private readonly movableHighlight: MovableHighlightSettingPlaywright) {}

  async setTo(name: MovableHighlightName): Promise<void> {
    try {
      await this.movableHighlight.choose(name);
    } catch (error) {
      throw new DslError(`Failed to set the movable-piece highlight to "${name}"`, error);
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

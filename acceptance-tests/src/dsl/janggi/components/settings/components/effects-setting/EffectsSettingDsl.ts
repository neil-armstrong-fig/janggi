import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import type {EffectsName} from "@janggi/shared/janggi/settings/EffectsName";
import {EffectsSettingPlaywright} from "@src/dsl/janggi/components/settings/components/effects-setting/playwright/EffectsSettingPlaywright";

/** The picker for how much the board moves, reached as `janggi.settings.effects`. */
export class EffectsSettingDsl {
  private readonly effects: EffectsSettingPlaywright;

  constructor(page: Page) {
    this.effects = new EffectsSettingPlaywright(page);
  }

  async setTo(name: EffectsName): Promise<void> {
    try {
      await this.effects.choose(name);
    } catch (error) {
      throw new DslError(`Failed to set the effects to "${name}"`, error);
    }
  }

  async getSelected(): Promise<EffectsName | undefined> {
    try {
      return await this.effects.getSelected();
    } catch (error) {
      throw new DslError("Failed to read which effects are selected", error);
    }
  }
}

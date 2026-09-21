import {BikjangHintSettingPlaywright} from "@src/dsl/janggi/components/settings/components/bikjang-hint-setting/playwright/BikjangHintSettingPlaywright";
import type {BikjangHintName} from "@janggi/shared/janggi/settings/BikjangHintName";
import {DslError} from "@src/dsl/errors/DslError";
import type {Page} from "@playwright/test";

/** The picker for labelling moves that could allow a bikjang, reached as `janggi.settings.bikjangHint`. */
export class BikjangHintSettingDsl {
  private readonly bikjangHint: BikjangHintSettingPlaywright;

  constructor(page: Page) {
    this.bikjangHint = new BikjangHintSettingPlaywright(page);
  }

  async setTo(name: BikjangHintName): Promise<void> {
    try {
      await this.bikjangHint.choose(name);
    } catch (error) {
      throw new DslError(`Failed to set the bikjang hint to "${name}"`, error);
    }
  }

  async getSelected(): Promise<BikjangHintName | undefined> {
    try {
      return await this.bikjangHint.getSelected();
    } catch (error) {
      throw new DslError("Failed to read whether the bikjang hint is shown", error);
    }
  }
}

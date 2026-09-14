import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import type {SideChoiceName} from "@janggi/shared/janggi/settings/SideChoiceName";
import {YourSideSettingPlaywright} from "@src/dsl/janggi/components/settings/components/your-side-setting/playwright/YourSideSettingPlaywright";

/** The picker for which army the player takes against the bot, reached as `janggi.settings.yourSide`. */
export class YourSideSettingDsl {
  private readonly side: YourSideSettingPlaywright;

  constructor(page: Page) {
    this.side = new YourSideSettingPlaywright(page);
  }

  async setTo(name: SideChoiceName): Promise<void> {
    try {
      await this.side.choose(name);
    } catch (error) {
      throw new DslError(`Failed to set your side to "${name}"`, error);
    }
  }

  async getSelected(): Promise<SideChoiceName | undefined> {
    try {
      return await this.side.getSelected();
    } catch (error) {
      throw new DslError("Failed to read which side you are playing", error);
    }
  }

  async isChoosable(): Promise<boolean> {
    try {
      return await this.side.isChoosable();
    } catch (error) {
      throw new DslError("Failed to check whether your side can still be chosen", error);
    }
  }
}

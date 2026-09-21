import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {HanSetupSettingPlaywright} from "@src/dsl/janggi/components/settings/components/han-setup-setting/playwright/HanSetupSettingPlaywright";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";

/**
 * Han's opening-arrangement picker, reached as `janggi.settings.hanSetup`.
 *
 * A picker each because the two armies genuinely arrange separately — Han lays out first and Cho
 * answers — so a spec that cares about the difference has to be able to say which it means.
 */
export class HanSetupSettingDsl {
  private readonly setup: HanSetupSettingPlaywright;

  constructor(page: Page) {
    this.setup = new HanSetupSettingPlaywright(page);
  }

  async setTo(name: SetupName): Promise<void> {
    try {
      await this.setup.choose(name);
    } catch (error) {
      throw new DslError(`Failed to set Han's setup to "${name}"`, error);
    }
  }

  async getSelected(): Promise<SetupName | undefined> {
    try {
      return await this.setup.getSelected();
    } catch (error) {
      throw new DslError("Failed to read which setup Han is using", error);
    }
  }

  /** Turns the switch to Han's army, so its setups are the ones showing. It chooses nothing. */
  async show(): Promise<void> {
    try {
      await this.setup.show();
    } catch (error) {
      throw new DslError("Failed to show Han's setups", error);
    }
  }

  /** Whether Han's setups are the ones showing, the two armies sharing one place in the sheet. */
  async isShown(): Promise<boolean> {
    try {
      return await this.setup.isShown();
    } catch (error) {
      throw new DslError("Failed to check whether Han's setups are showing", error);
    }
  }

  /** Whether the picker is still live — a back rank is arranged strictly before play. */
  async isChoosable(): Promise<boolean> {
    try {
      return await this.setup.isChoosable();
    } catch (error) {
      throw new DslError("Failed to check whether Han's setup can still be chosen", error);
    }
  }
}

import {DslError} from "@src/dsl/errors/DslError";
import type {HanSetupSettingPlaywright} from "@src/dsl/janggi/components/settings/components/han-setup-setting/playwright/HanSetupSettingPlaywright";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";

/**
 * Han's opening-arrangement picker, reached as `janggi.settings.hanSetup`.
 *
 * A picker each because the two armies genuinely arrange separately — Han lays out first and Cho
 * answers — so a spec that cares about the difference has to be able to say which it means.
 */
export class HanSetupSettingDsl {
  constructor(private readonly setup: HanSetupSettingPlaywright) {}

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

  /** Whether the picker is still live — a back rank is arranged strictly before play. */
  async isChoosable(): Promise<boolean> {
    try {
      return await this.setup.isChoosable();
    } catch (error) {
      throw new DslError("Failed to check whether Han's setup can still be chosen", error);
    }
  }
}

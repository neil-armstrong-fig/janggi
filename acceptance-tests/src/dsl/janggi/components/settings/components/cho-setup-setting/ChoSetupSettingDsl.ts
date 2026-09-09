import {DslError} from "@src/dsl/errors/DslError";
import type {ChoSetupSettingPlaywright} from "@src/dsl/janggi/components/settings/components/cho-setup-setting/playwright/ChoSetupSettingPlaywright";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";

/**
 * Cho's opening-arrangement picker, reached as `janggi.settings.choSetup`.
 *
 * A picker each because the two armies genuinely arrange separately — Han lays out first and Cho
 * answers — so a spec that cares about the difference has to be able to say which it means.
 */
export class ChoSetupSettingDsl {
  constructor(private readonly setup: ChoSetupSettingPlaywright) {}

  async setTo(name: SetupName): Promise<void> {
    try {
      await this.setup.choose(name);
    } catch (error) {
      throw new DslError(`Failed to set Cho's setup to "${name}"`, error);
    }
  }

  async getSelected(): Promise<SetupName | undefined> {
    try {
      return await this.setup.getSelected();
    } catch (error) {
      throw new DslError("Failed to read which setup Cho is using", error);
    }
  }

  /** Whether the picker is still live — a back rank is arranged strictly before play. */
  async isChoosable(): Promise<boolean> {
    try {
      return await this.setup.isChoosable();
    } catch (error) {
      throw new DslError("Failed to check whether Cho's setup can still be chosen", error);
    }
  }
}

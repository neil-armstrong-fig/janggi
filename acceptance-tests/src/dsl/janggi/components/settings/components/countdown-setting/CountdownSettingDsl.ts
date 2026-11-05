import type {Page} from "@playwright/test";
import {CountdownSettingPlaywright} from "@src/dsl/janggi/components/settings/components/countdown-setting/playwright/CountdownSettingPlaywright";
import {DslError} from "@src/dsl/errors/DslError";

/** The switch for the countdown in a clock's last ten seconds, reached as `janggi.settings.countdown`. */
export class CountdownSettingDsl {
  private readonly countdown: CountdownSettingPlaywright;

  constructor(page: Page) {
    this.countdown = new CountdownSettingPlaywright(page);
  }

  async isOn(): Promise<boolean> {
    try {
      return await this.countdown.isOn();
    } catch (error) {
      throw new DslError("Failed to read whether the countdown is on", error);
    }
  }

  async setTo(on: boolean): Promise<void> {
    try {
      await this.countdown.setTo(on);
    } catch (error) {
      throw new DslError(`Failed to set the countdown to ${on}`, error);
    }
  }
}

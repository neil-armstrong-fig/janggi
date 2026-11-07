import {OnOffSwitch} from "@src/dsl/janggi/components/settings/playwright/components/on-off-switch/OnOffSwitch";
import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/** The countdown switch in the Sound tab. `aria-pressed` is the state. */
export class CountdownSettingPlaywright extends SettingsSheetComponent {
  private readonly toggle: Locator;
  private readonly onOffSwitch: OnOffSwitch;

  constructor(page: Page) {
    super(page);

    this.toggle = page.getByTestId("countdown-toggle");

    this.onOffSwitch = new OnOffSwitch(this.toggle);
  }

  async isOn(): Promise<boolean> {
    return (await this.onOffSwitch.getSelected()) === true;
  }

  async setTo(on: boolean): Promise<void> {
    if ((await this.isOn()) === on) return;

    await this.inSheet(this.toggle, () => this.onOffSwitch.press());
  }
}

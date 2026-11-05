import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/** The countdown switch in the Sound tab. `aria-pressed` is the state. */
export class CountdownSettingPlaywright extends SettingsSheetComponent {
  private readonly toggle: Locator;

  constructor(page: Page) {
    super(page);

    this.toggle = page.getByTestId("countdown-toggle");
  }

  async isOn(): Promise<boolean> {
    await this.toggle.waitFor({state: "attached"});

    return (await this.toggle.getAttribute("aria-pressed")) === "true";
  }

  async setTo(on: boolean): Promise<void> {
    if ((await this.isOn()) === on) return;

    await this.inSheet(this.toggle, async () => {
      await this.toggle.click();
    });
  }
}

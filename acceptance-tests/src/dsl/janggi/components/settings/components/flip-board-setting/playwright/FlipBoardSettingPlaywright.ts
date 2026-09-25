import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/** The "Flip board for Han" check box. */
export class FlipBoardSettingPlaywright extends SettingsSheetComponent {
  private readonly toggle: Locator;

  constructor(page: Page) {
    super(page);

    this.toggle = page.getByTestId("flip-board-toggle");
  }

  async isOn(): Promise<boolean> {
    return (await this.toggle.getAttribute("aria-pressed")) === "true";
  }

  async setTo(on: boolean): Promise<void> {
    if ((await this.isOn()) === on) return;

    await this.inSheet(this.toggle, async () => {
      await this.toggle.click();
    });
  }
}

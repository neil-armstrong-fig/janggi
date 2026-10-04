import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/** The "Show opponent's board and pieces" switch. */
export class OpponentLookSettingPlaywright extends SettingsSheetComponent {
  private readonly toggle: Locator;
  private readonly explanation: Locator;

  constructor(page: Page) {
    super(page);

    this.toggle = page.getByTestId("opponent-look-toggle");
    this.explanation = page.getByTestId("opponent-look-explanation");
  }

  async isOn(): Promise<boolean> {
    return (await this.toggle.getAttribute("aria-pressed")) === "true";
  }

  async isShown(): Promise<boolean> {
    return (await this.toggle.count()) > 0;
  }

  async getExplanation(): Promise<string> {
    return await this.explanation.innerText();
  }

  async setTo(on: boolean): Promise<void> {
    if ((await this.isOn()) === on) return;

    await this.inSheet(this.toggle, async () => {
      await this.toggle.click();
    });
  }
}

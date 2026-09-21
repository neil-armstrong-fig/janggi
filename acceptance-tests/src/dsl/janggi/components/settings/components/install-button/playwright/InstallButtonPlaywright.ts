import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

export class InstallButtonPlaywright extends SettingsSheetComponent {
  private readonly installButton: Locator;

  constructor(page: Page) {
    super(page);

    this.installButton = page.getByTestId("settings-install");
  }

  /**
   * Whether the offer is on screen. The button is only in the page while the browser offers to install,
   * and only shown on a phone, so it is looked for in its tab: absent is a no, and present is a yes
   * only where its pane is showing, which is where the sheet chooses it.
   */
  async isShown(): Promise<boolean> {
    if ((await this.installButton.count()) === 0) return false;

    let shown = false;

    await this.inSheet(this.installButton, async () => {
      shown = await this.installButton.isVisible();
    });

    return shown;
  }

  async choose(): Promise<void> {
    await this.inSheet(this.installButton, async () => {
      await this.installButton.click();
    });
  }
}

import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

export class InstallButtonPlaywright extends SettingsSheetComponent {
  private readonly installButton: Locator;

  constructor(page: Page) {
    super(page);

    this.installButton = page.getByTestId("settings-install");
  }

  async isShown(): Promise<boolean> {
    return await this.installButton.isVisible();
  }

  async choose(): Promise<void> {
    await this.withSheetOpen(async () => {
      await this.installButton.click();
    });
  }
}

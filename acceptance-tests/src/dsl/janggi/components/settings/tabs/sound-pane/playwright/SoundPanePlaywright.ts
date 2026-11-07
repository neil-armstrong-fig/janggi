import type {Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/** The Sound pane's own settings queries and actions. */
export class SoundPanePlaywright extends SettingsSheetComponent {
  // The base constructor is protected, so the pane needs a public constructor.
  constructor(page: Page) {
    super(page);
  }

  async isEveryControlVisible(): Promise<boolean> {
    return (
      (await this.page.getByTestId("sound-effects-volume").isVisible()) &&
      (await this.page.getByTestId("music-volume").isVisible()) &&
      (await this.page.getByTestId("countdown-toggle").isVisible())
    );
  }
}

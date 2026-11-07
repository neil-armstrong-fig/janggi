import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/** The Sound pane's own settings queries and actions. */
export class SoundPanePlaywright extends SettingsSheetComponent {
  // The base constructor is protected, so the pane needs a public constructor.
  private readonly soundEffectsVolume: Locator;
  private readonly musicVolume: Locator;
  private readonly countdownToggle: Locator;

  constructor(page: Page) {
    super(page);

    this.soundEffectsVolume = this.page.getByTestId("sound-effects-volume");
    this.musicVolume = this.page.getByTestId("music-volume");
    this.countdownToggle = this.page.getByTestId("countdown-toggle");
  }

  async isEveryControlVisible(): Promise<boolean> {
    return (
      (await this.soundEffectsVolume.isVisible()) &&
      (await this.musicVolume.isVisible()) &&
      (await this.countdownToggle.isVisible())
    );
  }
}

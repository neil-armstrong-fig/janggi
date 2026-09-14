import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";

/** The volume slider for the music, and its mute. Read the same way as `SoundEffectsSettingPlaywright`. */
export class MusicSettingPlaywright extends SettingsSheetComponent {
  private readonly slider: Locator;
  private readonly mute: Locator;

  constructor(page: Page) {
    super(page);

    this.slider = page.getByTestId("music-volume");
    this.mute = page.getByTestId("music-mute");
  }

  async slideTo(volume: Volume): Promise<void> {
    await this.inSheet(() => this.slider.fill(String(volume)));
  }

  async pressMute(): Promise<void> {
    await this.inSheet(() => this.mute.click());
  }

  async getVolume(): Promise<Volume> {
    return Number(await this.slider.inputValue());
  }

  async isMuted(): Promise<boolean> {
    return (await this.mute.getAttribute("aria-pressed")) === "true";
  }
}

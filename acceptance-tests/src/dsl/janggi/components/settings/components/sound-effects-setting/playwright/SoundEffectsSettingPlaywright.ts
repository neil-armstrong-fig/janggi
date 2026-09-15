import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";

/**
 * The volume slider for the sound effects, and the speaker beside it that mutes them.
 *
 * Muted is read off the speaker's own pressed state rather than worked out from the volume, so a spec
 * asserting it is checking what the player is shown.
 */
export class SoundEffectsSettingPlaywright extends SettingsSheetComponent {
  private readonly slider: Locator;
  private readonly mute: Locator;

  constructor(page: Page) {
    super(page);

    this.slider = page.getByTestId("sound-effects-volume");
    this.mute = page.getByTestId("sound-effects-mute");
  }

  async slideTo(volume: Volume): Promise<void> {
    await this.inSheet(this.slider, () => this.slider.fill(String(volume)));
  }

  async pressMute(): Promise<void> {
    await this.inSheet(this.mute, () => this.mute.click());
  }

  async getVolume(): Promise<Volume> {
    return Number(await this.slider.inputValue());
  }

  async isMuted(): Promise<boolean> {
    return (await this.mute.getAttribute("aria-pressed")) === "true";
  }
}

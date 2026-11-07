import {VolumeSlider} from "@src/dsl/janggi/components/settings/tabs/sound-pane/playwright/components/volume-slider/VolumeSlider";
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
  private readonly volumeSlider: VolumeSlider;

  constructor(page: Page) {
    super(page);

    this.slider = page.getByTestId("sound-effects-volume");
    this.mute = page.getByTestId("sound-effects-mute");
    this.volumeSlider = new VolumeSlider(this.slider, this.mute);
  }

  async slideTo(volume: Volume): Promise<void> {
    await this.inSheet(this.slider, () => this.volumeSlider.slideTo(volume));
  }

  async pressMute(): Promise<void> {
    await this.inSheet(this.mute, () => this.volumeSlider.pressMute());
  }

  async getVolume(): Promise<Volume> {
    return await this.volumeSlider.getVolume();
  }

  async isMuted(): Promise<boolean> {
    return await this.volumeSlider.isMuted();
  }
}

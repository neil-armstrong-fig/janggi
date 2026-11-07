import {VolumeSlider} from "@src/dsl/janggi/components/settings/tabs/sound-pane/playwright/components/volume-slider/VolumeSlider";
import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";

/** The volume slider for the music, and its mute. Read the same way as `SoundEffectsSettingPlaywright`. */
export class MusicSettingPlaywright extends SettingsSheetComponent {
  private readonly slider: Locator;
  private readonly mute: Locator;
  private readonly volumeSlider: VolumeSlider;

  constructor(page: Page) {
    super(page);

    this.slider = page.getByTestId("music-volume");
    this.mute = page.getByTestId("music-mute");
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

  /** What the mute is called, for a screen reader. */
  async getMuteLabel(): Promise<string> {
    return await this.volumeSlider.getMuteLabel();
  }

  async isMuted(): Promise<boolean> {
    return await this.volumeSlider.isMuted();
  }
}

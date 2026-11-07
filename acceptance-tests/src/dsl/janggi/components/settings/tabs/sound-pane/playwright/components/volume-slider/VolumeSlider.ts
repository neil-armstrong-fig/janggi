import type {Locator} from "@playwright/test";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";

/** React's VolumeSlider: a volume range and the speaker button that mutes it. */
export class VolumeSlider {
  private readonly slider: Locator;
  private readonly mute: Locator;

  constructor(slider: Locator, mute: Locator) {
    this.slider = slider;
    this.mute = mute;
  }

  async slideTo(volume: Volume): Promise<void> {
    await this.slider.fill(String(volume));
  }

  async pressMute(): Promise<void> {
    await this.mute.click();
  }

  async getVolume(): Promise<Volume> {
    return Number(await this.slider.inputValue());
  }

  async getMuteLabel(): Promise<string> {
    return (await this.mute.getAttribute("aria-label")) ?? "";
  }

  /** Read the speaker's drawn state, independently of the volume figure. */
  async isMuted(): Promise<boolean> {
    return (await this.mute.getAttribute("aria-pressed")) === "true";
  }
}

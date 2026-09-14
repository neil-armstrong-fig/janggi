import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {SoundEffectsSettingPlaywright} from "@src/dsl/janggi/components/settings/components/sound-effects-setting/playwright/SoundEffectsSettingPlaywright";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";

/** The volume slider for the sound effects, reached as `janggi.settings.soundEffects`. */
export class SoundEffectsSettingDsl {
  private readonly soundEffects: SoundEffectsSettingPlaywright;

  constructor(page: Page) {
    this.soundEffects = new SoundEffectsSettingPlaywright(page);
  }

  async setTo(volume: Volume): Promise<void> {
    try {
      await this.soundEffects.slideTo(volume);
    } catch (error) {
      throw new DslError(`Failed to set the sound effects to volume ${volume}`, error);
    }
  }

  async toggleMute(): Promise<void> {
    try {
      await this.soundEffects.pressMute();
    } catch (error) {
      throw new DslError("Failed to press the sound effects' mute button", error);
    }
  }

  async getVolume(): Promise<Volume> {
    try {
      return await this.soundEffects.getVolume();
    } catch (error) {
      throw new DslError("Failed to read the sound effects' volume", error);
    }
  }

  async isMuted(): Promise<boolean> {
    try {
      return await this.soundEffects.isMuted();
    } catch (error) {
      throw new DslError("Failed to read whether the sound effects are shown as muted", error);
    }
  }
}

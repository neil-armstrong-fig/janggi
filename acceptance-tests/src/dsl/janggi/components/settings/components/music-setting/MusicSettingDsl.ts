import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {MusicSettingPlaywright} from "@src/dsl/janggi/components/settings/components/music-setting/playwright/MusicSettingPlaywright";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";

/** The volume slider for the music, reached as `janggi.settings.music`. */
export class MusicSettingDsl {
  private readonly music: MusicSettingPlaywright;

  constructor(page: Page) {
    this.music = new MusicSettingPlaywright(page);
  }

  async setTo(volume: Volume): Promise<void> {
    try {
      await this.music.slideTo(volume);
    } catch (error) {
      throw new DslError(`Failed to set the music to volume ${volume}`, error);
    }
  }

  async toggleMute(): Promise<void> {
    try {
      await this.music.pressMute();
    } catch (error) {
      throw new DslError("Failed to press the music's mute button", error);
    }
  }

  async getVolume(): Promise<Volume> {
    try {
      return await this.music.getVolume();
    } catch (error) {
      throw new DslError("Failed to read the music's volume", error);
    }
  }

  async isMuted(): Promise<boolean> {
    try {
      return await this.music.isMuted();
    } catch (error) {
      throw new DslError("Failed to read whether the music is shown as muted", error);
    }
  }
}

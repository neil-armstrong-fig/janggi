import {SoundPanePlaywright} from "@src/dsl/janggi/components/settings/tabs/sound-pane/playwright/SoundPanePlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import {SoundEffectsSettingDsl} from "@src/dsl/janggi/components/settings/tabs/sound-pane/components/sound-effects-setting/SoundEffectsSettingDsl";
import {MusicSettingDsl} from "@src/dsl/janggi/components/settings/tabs/sound-pane/components/music-setting/MusicSettingDsl";
import {CountdownSettingDsl} from "@src/dsl/janggi/components/settings/tabs/sound-pane/components/countdown-setting/CountdownSettingDsl";
import type {Page} from "@playwright/test";

/**
 * The Sound tab of the settings sheet, reached as `janggi.settings.sound`: one member per setting the app draws in it
 * (`webapp/src/react/pages/game/components/settings/tabs/sound-pane/`).
 */
export class SoundPaneDsl {
  private readonly soundPane: SoundPanePlaywright;

  readonly soundEffects: SoundEffectsSettingDsl;
  readonly music: MusicSettingDsl;
  readonly countdown: CountdownSettingDsl;

  constructor(page: Page) {
    this.soundPane = new SoundPanePlaywright(page);

    this.soundEffects = new SoundEffectsSettingDsl(page);
    this.music = new MusicSettingDsl(page);
    this.countdown = new CountdownSettingDsl(page);
  }

  async isEveryControlVisible(): Promise<boolean> {
    try {
      return await this.soundPane.isEveryControlVisible();
    } catch (error) {
      throw new DslError("Failed to check visible sound controls", error);
    }
  }
}

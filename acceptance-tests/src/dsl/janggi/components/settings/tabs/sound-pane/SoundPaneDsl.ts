import {SoundEffectsSettingDsl} from "@src/dsl/janggi/components/settings/tabs/sound-pane/components/sound-effects-setting/SoundEffectsSettingDsl";
import {MusicSettingDsl} from "@src/dsl/janggi/components/settings/tabs/sound-pane/components/music-setting/MusicSettingDsl";
import {CountdownSettingDsl} from "@src/dsl/janggi/components/settings/tabs/sound-pane/components/countdown-setting/CountdownSettingDsl";
import type {Page} from "@playwright/test";

/**
 * The Sound tab of the settings sheet, reached as `janggi.settings.sound`: one member per setting the app draws in it
 * (`webapp/src/react/pages/game/components/settings/tabs/sound-pane/`).
 */
export class SoundPaneDsl {
  readonly soundEffects: SoundEffectsSettingDsl;
  readonly music: MusicSettingDsl;
  readonly countdown: CountdownSettingDsl;

  constructor(page: Page) {
    this.soundEffects = new SoundEffectsSettingDsl(page);
    this.music = new MusicSettingDsl(page);
    this.countdown = new CountdownSettingDsl(page);
  }
}

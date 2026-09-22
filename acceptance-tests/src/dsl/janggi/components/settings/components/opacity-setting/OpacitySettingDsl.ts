import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {OpacitySettingPlaywright} from "@src/dsl/janggi/components/settings/components/opacity-setting/playwright/OpacitySettingPlaywright";
import type {Opacity} from "@janggi/shared/janggi/settings/Opacity";

/** The opacity slider for the settings sheet's own panel, reached as `janggi.settings.opacity`. */
export class OpacitySettingDsl {
  private readonly opacity: OpacitySettingPlaywright;

  constructor(page: Page) {
    this.opacity = new OpacitySettingPlaywright(page);
  }

  async setTo(opacity: Opacity): Promise<void> {
    try {
      await this.opacity.slideTo(opacity);
    } catch (error) {
      throw new DslError(`Failed to set the sheet's opacity to ${opacity}`, error);
    }
  }

  async getOpacity(): Promise<Opacity> {
    try {
      return await this.opacity.getOpacity();
    } catch (error) {
      throw new DslError("Failed to read the sheet's opacity", error);
    }
  }

  async getMinimum(): Promise<Opacity> {
    try {
      return await this.opacity.getMinimum();
    } catch (error) {
      throw new DslError("Failed to read the slider's minimum", error);
    }
  }

  async getMaximum(): Promise<Opacity> {
    try {
      return await this.opacity.getMaximum();
    } catch (error) {
      throw new DslError("Failed to read the slider's maximum", error);
    }
  }
}

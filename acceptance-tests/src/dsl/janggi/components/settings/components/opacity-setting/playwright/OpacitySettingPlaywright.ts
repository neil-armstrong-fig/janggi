import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";
import type {Opacity} from "@janggi/shared/janggi/settings/Opacity";

/** The opacity slider for the settings sheet's own panel. */
export class OpacitySettingPlaywright extends SettingsSheetComponent {
  private readonly slider: Locator;

  constructor(page: Page) {
    super(page);

    this.slider = page.getByTestId("sheet-opacity");
  }

  async slideTo(opacity: Opacity): Promise<void> {
    await this.inSheet(this.slider, () => this.slider.fill(String(opacity)));
  }

  async getOpacity(): Promise<Opacity> {
    return Number(await this.slider.inputValue());
  }

  async getMinimum(): Promise<Opacity> {
    return Number(await this.slider.getAttribute("min"));
  }

  async getMaximum(): Promise<Opacity> {
    return Number(await this.slider.getAttribute("max"));
  }
}

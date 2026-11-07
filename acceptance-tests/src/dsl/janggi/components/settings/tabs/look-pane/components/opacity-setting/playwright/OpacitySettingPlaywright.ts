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

  async getBackdropBlur(): Promise<number> {
    return await this.sheet.evaluate(sheet => parseFloat(getComputedStyle(sheet).backdropFilter.replace("blur(", "")));
  }

  async getRenderedOpacity(): Promise<Opacity> {
    return await this.sheet.evaluate(sheet => {
      const colour = getComputedStyle(sheet).backgroundColor;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Expected a canvas context to read the rendered colour");

      context.fillStyle = colour;
      context.fillRect(0, 0, 1, 1);
      return Math.round(((context.getImageData(0, 0, 1, 1).data[3] ?? 0) / 255) * 100);
    });
  }

  async getMinimum(): Promise<Opacity> {
    return Number(await this.slider.getAttribute("min"));
  }

  async getMaximum(): Promise<Opacity> {
    return Number(await this.slider.getAttribute("max"));
  }
}

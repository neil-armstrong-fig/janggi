import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/** The styles sheet's own navigation, apart from the controls it contains. */
export class StylesSheetPlaywright extends SettingsSheetComponent {
  private readonly stylesOpener: Locator;
  private readonly back: Locator;
  private readonly stylesSheet: Locator;

  constructor(page: Page) {
    super(page);

    this.stylesOpener = page.getByTestId("styles-open");
    this.back = page.getByTestId("styles-back");
    this.stylesSheet = page.getByTestId("styles");
  }

  async openStyles(): Promise<void> {
    await this.openSheet(this.stylesOpener);
    await this.stylesOpener.click();
    await this.stylesSheet.waitFor({state: "visible"});
  }

  async goBackToSettings(): Promise<void> {
    await this.back.click();
  }
}

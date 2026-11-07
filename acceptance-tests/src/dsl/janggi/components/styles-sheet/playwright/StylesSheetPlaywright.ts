import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/** The styles sheet's own navigation, apart from the controls it contains. */
export class StylesSheetPlaywright extends BaseComponent {
  private readonly stylesOpener: Locator;
  private readonly back: Locator;
  private readonly stylesSheet: Locator;
  private readonly closer: Locator;
  private readonly closed: Locator;

  constructor(page: Page) {
    super(page);

    this.stylesOpener = page.getByTestId("styles-open");
    this.back = page.getByTestId("styles-back");
    this.stylesSheet = page.getByTestId("styles");
    this.closer = page.getByTestId("styles-close");
    this.closed = page.locator("[data-testid='styles'][inert]");
  }

  async openStyles(): Promise<void> {
    await this.stylesOpener.click();
    await this.stylesSheet.waitFor({state: "visible"});
  }

  async closeStyles(): Promise<void> {
    await this.closer.click();
    await this.closed.waitFor({state: "attached"});
  }

  async getWords(): Promise<string> {
    return (await this.stylesSheet.textContent()) ?? "";
  }

  async goBackToSettings(): Promise<void> {
    await this.back.click();
  }
}

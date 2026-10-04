import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/** The brief message that appears over the page and leaves by itself. */
export class ToastPlaywright extends BaseComponent {
  private readonly toast: Locator;

  constructor(page: Page) {
    super(page);

    this.toast = page.getByTestId("toast");
  }

  /** What the toast says, or undefined where none is up. Counted, as an absence is its answer. */
  async getWords(): Promise<string | undefined> {
    if ((await this.toast.count()) === 0) return undefined;

    return (await this.toast.innerText()).trim();
  }
}

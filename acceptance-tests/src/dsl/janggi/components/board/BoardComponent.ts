import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/types/BaseComponent";

export class BoardComponent extends BaseComponent {
  readonly container: Locator;

  constructor(page: Page) {
    super(page);

    this.container = page.getByTestId("board");
  }

  /**
   * Waits rather than sampling. `goto` resolves on the load event, but React mounts after that, so
   * an immediate `isVisible()` would race the first render.
   */
  async isVisible(): Promise<boolean> {
    try {
      await this.container.waitFor({state: "visible"});
      return true;
    } catch {
      return false;
    }
  }
}

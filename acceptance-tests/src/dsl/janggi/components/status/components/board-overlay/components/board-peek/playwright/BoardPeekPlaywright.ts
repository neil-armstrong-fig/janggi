import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {isUnderTheSettings} from "@src/dsl/janggi/components/under-the-settings/playwright/IsUnderTheSettings";

/**
 * The locators behind `BoardPeekDsl` — the board looked at with the result put aside.
 */
export class BoardPeekPlaywright extends BaseComponent {
  private readonly boardPeek: Locator;

  constructor(page: Page) {
    super(page);

    this.boardPeek = page.getByTestId("result-peek");
  }

  /** Taps the board while the result is put aside, which brings the announcement back. */
  async tapTheBoardToSeeTheResult(): Promise<void> {
    await this.boardPeek.click({position: {x: 5, y: 5}});
  }

  /** Whether the open settings sheet stands over the board-sized tap that brings the result back. */
  async isUnderTheSettings(): Promise<boolean> {
    return await isUnderTheSettings(this.page, this.boardPeek);
  }

  /** Whether the board is being looked at with the result put aside, which the note over it says. */
  async isBoardShown(): Promise<boolean> {
    return (await this.boardPeek.count()) > 0;
  }
}

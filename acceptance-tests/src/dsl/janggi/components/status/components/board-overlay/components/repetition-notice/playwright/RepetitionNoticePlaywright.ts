import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/**
 * The locators behind `RepetitionNoticeDsl` — the note over the board that a move repeating the position is held back.
 */
export class RepetitionNoticePlaywright extends BaseComponent {
  private readonly repetitionNotice: Locator;

  constructor(page: Page) {
    super(page);

    this.repetitionNotice = page.getByTestId("repetition-notice");
  }

  /** Whether a note over the board explains that a move repeating the position is being held back. */
  async isRepetitionExplained(): Promise<boolean> {
    return (await this.repetitionNotice.count()) > 0;
  }
}

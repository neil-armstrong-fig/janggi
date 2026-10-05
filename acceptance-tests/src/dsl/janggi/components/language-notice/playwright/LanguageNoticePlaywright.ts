import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/** The note that tells a player the Korean is still being written, which is up until they have read it. */
export class LanguageNoticePlaywright extends BaseComponent {
  private readonly notice: Locator;
  private readonly dismiss: Locator;

  constructor(page: Page) {
    super(page);

    this.notice = page.getByTestId("language-notice");
    this.dismiss = page.getByTestId("language-notice-dismiss");
  }

  /** Counted, as an absence is its answer. */
  async isShown(): Promise<boolean> {
    return (await this.notice.count()) > 0;
  }

  /** What the note says, in both languages. */
  async getWords(): Promise<string> {
    return ((await this.notice.textContent()) ?? "").trim();
  }

  async dismissIt(): Promise<void> {
    await this.dismiss.click();
  }
}

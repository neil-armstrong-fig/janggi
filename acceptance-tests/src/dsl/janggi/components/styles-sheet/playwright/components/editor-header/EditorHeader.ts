import type {Locator, Page} from "@playwright/test";

/** The styles editor header's back control, returning from a retained editor to the list inside the already-open styles sheet. */
export class EditorHeader {
  private readonly editorBack: Locator;

  constructor(page: Page) {
    this.editorBack = page.getByTestId("style-editor-back");
  }

  async returnToList(): Promise<void> {
    if (await this.editorBack.isVisible()) await this.editorBack.click();
  }
}

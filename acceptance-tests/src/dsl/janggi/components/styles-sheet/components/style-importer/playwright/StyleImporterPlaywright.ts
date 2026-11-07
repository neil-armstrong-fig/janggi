import {EditorHeader} from "@src/dsl/janggi/components/styles-sheet/playwright/components/editor-header/EditorHeader";
import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/** The box a player pastes a shared board or piece set key into. */
export class StyleImporterPlaywright extends BaseComponent {
  private readonly editorHeader: EditorHeader;
  private readonly input: Locator;
  private readonly submit: Locator;
  private readonly message: Locator;

  constructor(page: Page) {
    super(page);

    this.editorHeader = new EditorHeader(page);

    this.input = page.getByTestId("style-import-input");
    this.submit = page.getByTestId("style-import-submit");
    this.message = page.getByTestId("style-import-message");
  }

  async importStyle(key: string): Promise<void> {
    await this.editorHeader.returnToList();
    await this.input.fill(key);
    await this.submit.click();
    await this.message.waitFor({state: "attached"});
  }

  async isRefused(): Promise<boolean> {
    return (await this.message.getAttribute("data-accepted")) === "false";
  }

  async getMessage(): Promise<string> {
    return (await this.message.textContent()) ?? "";
  }
}

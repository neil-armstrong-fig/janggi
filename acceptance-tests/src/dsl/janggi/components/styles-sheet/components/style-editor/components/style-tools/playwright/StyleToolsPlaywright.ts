import type {Locator, Page} from "@playwright/test";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {StylesSheetComponent} from "@src/dsl/janggi/components/styles-sheet/playwright/StylesSheetComponent";

/** The ways to start a style being made over, folded under "Load or reset": put it back, load another, or paste a key. */
export class StyleToolsPlaywright extends StylesSheetComponent {
  private readonly tools: Locator;
  private readonly toolsToggle: Locator;
  private readonly resetButton: Locator;
  private readonly copyFrom: Locator;
  private readonly copyScope: Locator;
  private readonly copy: Locator;
  private readonly loadKeyInput: Locator;
  private readonly loadKeySubmit: Locator;
  private readonly loadKeyMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.tools = page.getByTestId("style-editor-tools");
    this.toolsToggle = this.tools.locator("summary");
    this.resetButton = page.getByTestId("style-editor-reset");
    this.copyFrom = page.getByTestId("style-editor-copy-from");
    this.copyScope = page.getByTestId("style-editor-copy-scope");
    this.copy = page.getByTestId("style-editor-copy");
    this.loadKeyInput = page.getByTestId("style-editor-import-input");
    this.loadKeySubmit = page.getByTestId("style-editor-import-submit");
    this.loadKeyMessage = page.getByTestId("style-editor-import-message");
  }

  /** Puts back the style being made as it was started, discarding every change since. */
  async reset(): Promise<void> {
    await this.inStyles(async () => {
      await this.openTools();
      await this.resetButton.click();
    });
  }

  /** Loads a style the player has into the one being made — a whole set, or one army's pieces of it. */
  async loadFrom(name: string, scope: Side | "both"): Promise<void> {
    await this.inStyles(async () => {
      await this.openTools();
      await this.copyFrom.selectOption(name);
      if ((await this.copyScope.count()) > 0) await this.copyScope.selectOption(scope);
      await this.copy.click();
    });
  }

  /** Pastes a key into the editor, to load the style in it in place of the one being made. */
  async loadKey(key: string): Promise<void> {
    await this.inStyles(async () => {
      await this.openTools();
      await this.loadKeyInput.fill(key);
      await this.loadKeySubmit.click();
      await this.loadKeyMessage.waitFor({state: "attached"});
    });
  }

  async isLoadRefused(): Promise<boolean> {
    return (await this.loadKeyMessage.getAttribute("data-accepted")) === "false";
  }

  private async openTools(): Promise<void> {
    if ((await this.tools.getAttribute("open")) === null) await this.toolsToggle.click();
  }
}

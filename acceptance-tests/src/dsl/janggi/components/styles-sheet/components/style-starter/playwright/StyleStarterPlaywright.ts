import {EditorHeader} from "@src/dsl/janggi/components/styles-sheet/playwright/components/editor-header/EditorHeader";
import type {Locator, Page} from "@playwright/test";
import type {StyleKind} from "@janggi/shared/janggi/settings/StyleKind";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/** Where making a style of one's own begins: which kind, which style to start from, and the Start button. */
export class StyleStarterPlaywright extends BaseComponent {
  private readonly editorHeader: EditorHeader;
  private readonly kind: Locator;
  private readonly from: Locator;
  private readonly startButton: Locator;

  constructor(page: Page) {
    super(page);

    this.editorHeader = new EditorHeader(page);

    this.kind = page.getByTestId("style-editor-kind");
    this.from = page.getByTestId("style-editor-from");
    this.startButton = page.getByTestId("style-editor-start");
  }

  /** Counted rather than waited for: an editor that is locked is the answer, not something to wait out. */
  async canMakeStyles(): Promise<boolean> {
    return (await this.startButton.count()) > 0;
  }

  async start(styleKind: StyleKind, from: string): Promise<void> {
    await this.editorHeader.returnToList();
    await this.kind.selectOption(styleKind);
    await this.from.selectOption(from);
    await this.startButton.click();
  }
}

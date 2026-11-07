import {EditorHeader} from "@src/dsl/janggi/components/styles-sheet/playwright/components/editor-header/EditorHeader";
import type {Locator, Page} from "@playwright/test";
import type {StyleKind} from "@janggi/shared/janggi/settings/StyleKind";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/** The player's own board styles and piece sets, each with a key to share it by and a way to delete it. */
export class OwnStylesPlaywright extends BaseComponent {
  private readonly editorHeader: EditorHeader;
  private readonly rows: Record<StyleKind, Locator>;

  constructor(page: Page) {
    super(page);

    this.editorHeader = new EditorHeader(page);
    this.rows = {
      Board: page.locator("[data-testid='custom-style'][data-kind='Board']"),
      Pieces: page.locator("[data-testid='custom-style'][data-kind='Pieces']"),
    };
  }

  async getNames(kind: StyleKind): Promise<readonly string[]> {
    return await this.rows[kind].evaluateAll(rows => rows.map(row => row.getAttribute("data-name") ?? ""));
  }

  async getKey(kind: StyleKind, name: string): Promise<string> {
    await this.editorHeader.returnToList();
    const row = this.rowFor(kind, name);
    await row.getByTestId("custom-style-copy").click();
    return await row.getByTestId("custom-style-key").inputValue();
  }

  async delete(kind: StyleKind, name: string): Promise<void> {
    await this.editorHeader.returnToList();
    await this.rowFor(kind, name).getByTestId("custom-style-delete").click();
  }

  private rowFor(kind: StyleKind, name: string): Locator {
    return this.rows[kind].and(this.page.locator(`[data-name='${name}']`));
  }
}

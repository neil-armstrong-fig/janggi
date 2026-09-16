import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";
import type {StyleKind} from "@janggi/shared/janggi/settings/StyleKind";

/**
 * The player's own styles — a sheet that slides up over the game, opened from the Appearance section
 * of the settings sheet, which it replaces on screen.
 *
 * Every action opens it, acts and closes it again, as `RecordSheetPlaywright` does, so a spec never says
 * where it is standing. It borrows the settings sheet's `openSheet` to get to the button, the button
 * sitting in a section that may be folded. Reading needs no opening at all: the sheet is always in the
 * page, and only `inert` while closed, which is what closing waits for.
 */
export class StylesSheetPlaywright extends SettingsSheetComponent {
  private readonly stylesOpener: Locator;
  private readonly stylesCloser: Locator;
  private readonly closed: Locator;
  private readonly importInput: Locator;
  private readonly importSubmit: Locator;
  private readonly importMessage: Locator;
  private readonly editorKind: Locator;
  private readonly editorFrom: Locator;
  private readonly editorName: Locator;
  private readonly editorJson: Locator;
  private readonly editorSave: Locator;
  private readonly editorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.stylesOpener = page.getByTestId("styles-open");
    this.stylesCloser = page.getByTestId("styles-close");
    this.closed = page.locator("[data-testid='styles'][inert]");
    this.importInput = page.getByTestId("style-import-input");
    this.importSubmit = page.getByTestId("style-import-submit");
    this.importMessage = page.getByTestId("style-import-message");
    this.editorKind = page.getByTestId("style-editor-kind");
    this.editorFrom = page.getByTestId("style-editor-from");
    this.editorName = page.getByTestId("style-editor-name");
    this.editorJson = page.getByTestId("style-editor-json");
    this.editorSave = page.getByTestId("style-editor-save");
    this.editorMessage = page.getByTestId("style-editor-message");
  }

  async importStyle(key: string): Promise<void> {
    await this.inStyles(async () => {
      await this.importInput.fill(key);
      await this.importSubmit.click();
      await this.importMessage.waitFor({state: "attached"});
    });
  }

  async isImportRefused(): Promise<boolean> {
    return (await this.importMessage.getAttribute("data-accepted")) === "false";
  }

  async getImportMessage(): Promise<string> {
    return (await this.importMessage.textContent()) ?? "";
  }

  async getOwnStyleNames(kind: StyleKind): Promise<readonly string[]> {
    return await this.page
      .locator(`[data-testid='custom-style'][data-kind='${kind}']`)
      .evaluateAll(rows => rows.map(row => row.getAttribute("data-name") ?? ""));
  }

  async getStyleKey(kind: StyleKind, name: string): Promise<string> {
    let key = "";

    await this.inStyles(async () => {
      const row = this.rowFor(kind, name);
      await row.getByTestId("custom-style-copy").click();
      key = await row.getByTestId("custom-style-key").inputValue();
    });

    return key;
  }

  async deleteStyle(kind: StyleKind, name: string): Promise<void> {
    await this.inStyles(async () => {
      await this.rowFor(kind, name).getByTestId("custom-style-delete").click();
    });
  }

  /** Counted rather than waited for: an editor that is locked is the answer, not something to wait out. */
  async canMakeStyles(): Promise<boolean> {
    return (await this.editorSave.count()) > 0;
  }

  async makeStyle(kind: StyleKind, from: string, name: string, json: string | undefined): Promise<void> {
    await this.inStyles(async () => {
      await this.editorKind.selectOption(kind);
      await this.editorFrom.selectOption(from);
      await this.editorName.fill(name);
      if (json !== undefined) await this.editorJson.fill(json);

      await this.editorSave.click();
      await this.editorMessage.waitFor({state: "attached"});
    });
  }

  async isEditorRefused(): Promise<boolean> {
    return (await this.editorMessage.getAttribute("data-accepted")) === "false";
  }

  /** Opens the styles sheet by way of the settings sheet, does something in it, and closes it again. */
  private async inStyles(act: () => Promise<void>): Promise<void> {
    await this.openSheet(this.stylesOpener);
    await this.stylesOpener.click();

    await act();

    await this.stylesCloser.click();
    await this.closed.waitFor({state: "attached"});
  }

  private rowFor(kind: StyleKind, name: string): Locator {
    return this.page.locator(`[data-testid='custom-style'][data-kind='${kind}'][data-name='${name}']`);
  }
}

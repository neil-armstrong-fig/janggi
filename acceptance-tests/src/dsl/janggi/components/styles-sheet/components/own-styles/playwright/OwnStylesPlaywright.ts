import type {Locator, Page} from "@playwright/test";
import type {StyleKind} from "@janggi/shared/janggi/settings/StyleKind";
import {StylesSheetComponent} from "@src/dsl/janggi/components/styles-sheet/playwright/StylesSheetComponent";

/** The player's own board styles and piece sets, each with a key to share it by and a way to delete it. */
export class OwnStylesPlaywright extends StylesSheetComponent {
  constructor(page: Page) {
    super(page);
  }

  async getNames(kind: StyleKind): Promise<readonly string[]> {
    return await this.page
      .locator(`[data-testid='custom-style'][data-kind='${kind}']`)
      .evaluateAll(rows => rows.map(row => row.getAttribute("data-name") ?? ""));
  }

  async getKey(kind: StyleKind, name: string): Promise<string> {
    let key = "";

    await this.inStyleList(async () => {
      const row = this.rowFor(kind, name);
      await row.getByTestId("custom-style-copy").click();
      key = await row.getByTestId("custom-style-key").inputValue();
    });

    return key;
  }

  async delete(kind: StyleKind, name: string): Promise<void> {
    await this.inStyleList(async () => {
      await this.rowFor(kind, name).getByTestId("custom-style-delete").click();
    });
  }

  private rowFor(kind: StyleKind, name: string): Locator {
    return this.page.locator(`[data-testid='custom-style'][data-kind='${kind}'][data-name='${name}']`);
  }
}

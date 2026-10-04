import type {Page} from "@playwright/test";
import {OwnStylesDsl} from "@src/dsl/janggi/components/styles-sheet/components/own-styles/OwnStylesDsl";
import {StyleEditorDsl} from "@src/dsl/janggi/components/styles-sheet/components/style-editor/StyleEditorDsl";
import {StyleImporterDsl} from "@src/dsl/janggi/components/styles-sheet/components/style-importer/StyleImporterDsl";
import type {StyleKind} from "@janggi/shared/janggi/settings/StyleKind";
import {StyleStarterDsl} from "@src/dsl/janggi/components/styles-sheet/components/style-starter/StyleStarterDsl";
import {DslError} from "@src/dsl/errors/DslError";
import {StylesSheetPlaywright} from "@src/dsl/janggi/components/styles-sheet/playwright/StylesSheetPlaywright";

/**
 * The player's own styles, reached as `janggi.stylesSheet` — a sheet that slides up over the game,
 * opened from the Progress section of the settings sheet, which it replaces on screen.
 *
 * One member per part of the sheet, so a spec says which one it means before it says what to do with
 * it: `ownStyles` lists what the player has, `styleImporter` adds one from a shared key, `styleStarter`
 * opens the editor on a style, and `styleEditor` is what changes it — itself divided the same way its
 * `tools`, `preview` and `controls` are.
 *
 * Opening and returning to Settings belong to the sheet itself. Opening and closing around a control
 * remains common to every child in `StylesSheetComponent`.
 */
export class StylesSheetDsl {
  private readonly styles: StylesSheetPlaywright;

  readonly ownStyles: OwnStylesDsl;
  readonly styleImporter: StyleImporterDsl;
  readonly styleStarter: StyleStarterDsl;
  readonly styleEditor: StyleEditorDsl;

  constructor(page: Page) {
    this.styles = new StylesSheetPlaywright(page);

    this.ownStyles = new OwnStylesDsl(page);
    this.styleImporter = new StyleImporterDsl(page);
    this.styleStarter = new StyleStarterDsl(page);
    this.styleEditor = new StyleEditorDsl(page);
  }

  async openStyles(): Promise<void> {
    try {
      await this.styles.openStyles();
    } catch (error) {
      throw new DslError("Failed to open the player's styles", error);
    }
  }

  async goBackToSettings(): Promise<void> {
    try {
      await this.styles.goBackToSettings();
    } catch (error) {
      throw new DslError("Failed to go back from styles to Settings", error);
    }
  }

  /**
   * Makes a style in the editor, starting from one the player has, under `name` — as the editor fills it
   * in, or with its raw JSON replaced by `json` where one is given — and saves it. Reaches across
   * `styleStarter` and `styleEditor`, which is why it is here rather than on either.
   */
  async makeStyle(styleKind: StyleKind, from: string, name: string, json?: string): Promise<void> {
    await this.styleStarter.start(styleKind, from);

    if (json !== undefined) {
      await this.styleEditor.showRaw();
      await this.styleEditor.setRaw(json);
    }

    await this.styleEditor.save(name);
  }
}

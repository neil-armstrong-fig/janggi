import type {Page} from "@playwright/test";
import {OwnStylesDsl} from "@src/dsl/janggi/components/styles-sheet/components/own-styles/OwnStylesDsl";
import {StyleEditorDsl} from "@src/dsl/janggi/components/styles-sheet/components/style-editor/StyleEditorDsl";
import {StyleImporterDsl} from "@src/dsl/janggi/components/styles-sheet/components/style-importer/StyleImporterDsl";
import type {StyleKind} from "@janggi/shared/janggi/settings/StyleKind";
import {StyleStarterDsl} from "@src/dsl/janggi/components/styles-sheet/components/style-starter/StyleStarterDsl";

/**
 * The player's own styles, reached as `janggi.stylesSheet` — a sheet that slides up over the game,
 * opened from the Appearance section of the settings sheet, which it replaces on screen.
 *
 * One member per part of the sheet, so a spec says which one it means before it says what to do with
 * it: `ownStyles` lists what the player has, `styleImporter` adds one from a shared key, `styleStarter`
 * opens the editor on a style, and `styleEditor` is what changes it — itself divided the same way its
 * `tools`, `preview` and `controls` are.
 *
 * No member of its own: opening and closing the sheet is common to every part of it, so it lives on
 * `StylesSheetComponent`, which each child's `*Playwright` extends rather than holds, and there is
 * nothing left here that belongs to no single child except `makeStyle`.
 */
export class StylesSheetDsl {
  readonly ownStyles: OwnStylesDsl;
  readonly styleImporter: StyleImporterDsl;
  readonly styleStarter: StyleStarterDsl;
  readonly styleEditor: StyleEditorDsl;

  constructor(page: Page) {
    this.ownStyles = new OwnStylesDsl(page);
    this.styleImporter = new StyleImporterDsl(page);
    this.styleStarter = new StyleStarterDsl(page);
    this.styleEditor = new StyleEditorDsl(page);
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

import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {StyleControlsDsl} from "@src/dsl/janggi/components/styles-sheet/components/style-editor/components/style-controls/StyleControlsDsl";
import {StyleEditorPlaywright} from "@src/dsl/janggi/components/styles-sheet/components/style-editor/playwright/StyleEditorPlaywright";
import {StylePreviewDsl} from "@src/dsl/janggi/components/styles-sheet/components/style-editor/components/style-preview/StylePreviewDsl";
import {StyleToolsDsl} from "@src/dsl/janggi/components/styles-sheet/components/style-editor/components/style-tools/StyleToolsDsl";

/**
 * A style being made, reached as `janggi.stylesSheet.styleEditor` — a board of its own, wearing the
 * style as it stands, with a control for every setting and the raw JSON as a second view of the same
 * style. What stays here, rather than on a child, is the frame around all of that: the name, Save, and
 * the Controls/Raw JSON toggle.
 */
export class StyleEditorDsl {
  private readonly styleEditor: StyleEditorPlaywright;

  readonly tools: StyleToolsDsl;
  readonly preview: StylePreviewDsl;
  readonly controls: StyleControlsDsl;

  constructor(page: Page) {
    this.styleEditor = new StyleEditorPlaywright(page);

    this.tools = new StyleToolsDsl(page);
    this.preview = new StylePreviewDsl(page);
    this.controls = new StyleControlsDsl(page);
  }

  /** Saves the style being made, under `name` where one is given, or under the name it already has otherwise. */
  async save(name?: string): Promise<void> {
    try {
      await this.styleEditor.save(name);
    } catch (error) {
      throw new DslError(
        name === undefined ? "Failed to save the style" : `Failed to save the style as "${name}"`,
        error,
      );
    }
  }

  /** Whether the editor refused the last style saved in it. */
  async isRefused(): Promise<boolean> {
    try {
      return await this.styleEditor.isRefused();
    } catch (error) {
      throw new DslError("Failed to read whether the editor refused the style", error);
    }
  }

  /** What the name box holds. */
  async getName(): Promise<string> {
    try {
      return await this.styleEditor.getName();
    } catch (error) {
      throw new DslError("Failed to read the name of the style", error);
    }
  }

  async showRaw(): Promise<void> {
    try {
      await this.styleEditor.showRaw();
    } catch (error) {
      throw new DslError("Failed to show the style as raw JSON", error);
    }
  }

  async showControls(): Promise<void> {
    try {
      await this.styleEditor.showControls();
    } catch (error) {
      throw new DslError("Failed to show the style's controls", error);
    }
  }

  async getRaw(): Promise<string> {
    try {
      return await this.styleEditor.getRaw();
    } catch (error) {
      throw new DslError("Failed to read the style's raw JSON", error);
    }
  }

  /** Replaces the raw JSON of the style being made. */
  async setRaw(json: string): Promise<void> {
    try {
      await this.styleEditor.setRaw(json);
    } catch (error) {
      throw new DslError("Failed to write the style's raw JSON", error);
    }
  }

  /** Whether the raw view is telling the player what is wrong with what they typed. */
  async isRawRefused(): Promise<boolean> {
    try {
      return await this.styleEditor.isRawRefused();
    } catch (error) {
      throw new DslError("Failed to read whether the raw JSON was refused", error);
    }
  }
}

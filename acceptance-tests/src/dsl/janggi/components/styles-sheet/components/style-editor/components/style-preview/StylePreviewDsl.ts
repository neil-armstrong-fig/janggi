import {DslError} from "@src/dsl/errors/DslError";
import type {Page} from "@playwright/test";
import {StylePreviewPlaywright} from "@src/dsl/janggi/components/styles-sheet/components/style-editor/components/style-preview/playwright/StylePreviewPlaywright";

/**
 * The board a style being made is shown on, reached as `janggi.stylesSheet.styleEditor.preview` — the
 * real board, drawn in the style as it stands, so a control's effect is seen at once.
 */
export class StylePreviewDsl {
  private readonly stylePreview: StylePreviewPlaywright;

  constructor(page: Page) {
    this.stylePreview = new StylePreviewPlaywright(page);
  }

  /** Taps a point on the preview to choose it, or the piece on it, as what the controls change. */
  async tap(file: number, rank: number): Promise<void> {
    try {
      await this.stylePreview.tap(file, rank);
    } catch (error) {
      throw new DslError(`Failed to tap file ${file}, rank ${rank} of the preview`, error);
    }
  }

  /** What the controls are changing, as the editor names it — `Cho`, `Cho general`, `Every point`. */
  async getTarget(): Promise<string> {
    try {
      return await this.stylePreview.getTarget();
    } catch (error) {
      throw new DslError("Failed to read what the controls are changing", error);
    }
  }

  /** Takes back what was changed for the one point or piece chosen, leaving it as the rest are. */
  async resetTarget(): Promise<void> {
    try {
      await this.stylePreview.resetTarget();
    } catch (error) {
      throw new DslError("Failed to reset what the controls are changing", error);
    }
  }

  /** Shows the style being made with another piece set, or on another board — the preview only. */
  async showWith(name: string): Promise<void> {
    try {
      await this.stylePreview.showWith(name);
    } catch (error) {
      throw new DslError(`Failed to show the style with "${name}"`, error);
    }
  }

  /** The colour a point's lines are drawn in on the preview, as the browser resolves it — `rgb(…)`. */
  async getLineColourAt(file: number, rank: number): Promise<string> {
    try {
      return await this.stylePreview.getLineColourAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to read the lines at file ${file}, rank ${rank} of the preview`, error);
    }
  }

  /** How thick a point's lines are drawn on the preview. */
  async getLineWidthAt(file: number, rank: number): Promise<number> {
    try {
      return await this.stylePreview.getLineWidthAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to read the lines at file ${file}, rank ${rank} of the preview`, error);
    }
  }

  async getPieceCount(): Promise<number> {
    try {
      return await this.stylePreview.getPieceCount();
    } catch (error) {
      throw new DslError("Failed to count the pieces on the preview", error);
    }
  }

  /** How wide a piece is drawn on the preview, in pixels. */
  async getPieceWidthAt(file: number, rank: number): Promise<number | undefined> {
    try {
      return await this.stylePreview.getPieceWidthAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to measure the piece at file ${file}, rank ${rank} of the preview`, error);
    }
  }

  /** What is written on a piece in the preview, or undefined where it carries a drawing. */
  async getCharacterAt(file: number, rank: number): Promise<string | undefined> {
    try {
      return await this.stylePreview.getCharacterAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to read the writing at file ${file}, rank ${rank} of the preview`, error);
    }
  }

  /** The path data a piece is drawn with in the preview, or undefined where it is written on instead. */
  async getDrawingAt(file: number, rank: number): Promise<string | undefined> {
    try {
      return await this.stylePreview.getDrawingAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to read the drawing at file ${file}, rank ${rank} of the preview`, error);
    }
  }
}

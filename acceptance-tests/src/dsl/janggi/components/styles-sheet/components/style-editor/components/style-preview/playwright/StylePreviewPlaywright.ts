import type {Locator, Page} from "@playwright/test";
import {StylesSheetComponent} from "@src/dsl/janggi/components/styles-sheet/playwright/StylesSheetComponent";

/**
 * The board the style being made is shown on: tapping a point or a piece on it points the controls at
 * just that one, and what is drawn there is read back to see what a control changed.
 */
export class StylePreviewPlaywright extends StylesSheetComponent {
  private readonly preview: Locator;
  private readonly target: Locator;
  private readonly targetReset: Locator;
  private readonly companion: Locator;

  constructor(page: Page) {
    super(page);

    this.preview = page.getByTestId("style-preview");
    this.target = page.getByTestId("style-editor-target");
    this.targetReset = page.getByTestId("style-editor-target-reset");
    this.companion = page.getByTestId("style-editor-companion");
  }

  /** Taps a point of the style being made, as a player does to choose which point or piece to change. */
  async tap(file: number, rank: number): Promise<void> {
    await this.inStyles(async () => {
      await this.cellAt(file, rank).click();
    });
  }

  async getTarget(): Promise<string> {
    return (await this.target.textContent()) ?? "";
  }

  async resetTarget(): Promise<void> {
    await this.inStyles(async () => {
      await this.targetReset.click();
    });
  }

  /** Shows the style being made with another piece set (for a board) or on another board (for a piece set). */
  async showWith(name: string): Promise<void> {
    await this.inStyles(async () => {
      await this.companion.selectOption(name);
    });
  }

  /** The colour a point's lines are drawn in, as the browser resolves it — `rgb(…)`. */
  async getLineColourAt(file: number, rank: number): Promise<string> {
    return await this.cellAt(file, rank)
      .locator("svg line")
      .first()
      .evaluate(line => getComputedStyle(line).stroke);
  }

  /** How thick a point's lines are drawn, in the units of the cell they are drawn in. */
  async getLineWidthAt(file: number, rank: number): Promise<number> {
    return await this.cellAt(file, rank)
      .locator("svg line")
      .first()
      .evaluate(line => Number.parseFloat(getComputedStyle(line).strokeWidth));
  }

  async getPieceCount(): Promise<number> {
    return await this.preview.getByTestId("piece").count();
  }

  /** How wide a piece is drawn, in pixels. */
  async getPieceWidthAt(file: number, rank: number): Promise<number | undefined> {
    const box = await this.cellAt(file, rank).getByTestId("piece").boundingBox();

    return box?.width;
  }

  /** What is written on a piece, or undefined where it carries a drawing. */
  async getCharacterAt(file: number, rank: number): Promise<string | undefined> {
    const character = this.cellAt(file, rank).getByTestId("piece").locator("text");
    if ((await character.count()) === 0) return undefined;

    return (await character.textContent()) ?? undefined;
  }

  /** The path data a piece is drawn with, or undefined where it is written on instead. */
  async getDrawingAt(file: number, rank: number): Promise<string | undefined> {
    const drawing = this.cellAt(file, rank).getByTestId("piece").locator("path");
    if ((await drawing.count()) === 0) return undefined;

    return (await drawing.getAttribute("d")) ?? undefined;
  }

  private cellAt(file: number, rank: number): Locator {
    return this.preview.getByTestId(`cell-f${file}r${rank}`);
  }
}

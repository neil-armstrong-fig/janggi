import type {Locator, Page} from "@playwright/test";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import {StylesSheetComponent} from "@src/dsl/janggi/components/styles-sheet/playwright/StylesSheetComponent";
import type {StyleControlName} from "@src/dsl/janggi/components/styles-sheet/components/style-editor/components/style-controls/types/StyleControlName";
import type {StyleOptionName} from "@src/dsl/janggi/components/styles-sheet/components/style-editor/components/style-controls/types/StyleOptionName";

/** Every setting of the style being made — the colours, sliders and choices, and the SVG a drawing may be replaced with. */
export class StyleControlsPlaywright extends StylesSheetComponent {
  private readonly controls: Record<StyleControlName, Locator>;
  private readonly options: Record<StyleOptionName, Locator>;
  private readonly drawings: Record<PieceType, Locator>;
  private readonly drawingMessages: Record<PieceType, Locator>;

  constructor(page: Page) {
    super(page);

    this.controls = {
      "line-colour": page.getByTestId("style-control-line-colour"),
      "line-width": page.getByTestId("style-control-line-width"),
      "surface-colour": page.getByTestId("style-control-surface-colour"),
      "bikjang-colour": page.getByTestId("style-control-bikjang-colour"),
      "bikjang-width": page.getByTestId("style-control-bikjang-width"),
      "check-colour": page.getByTestId("style-control-check-colour"),
      "piece-size": page.getByTestId("style-control-piece-size"),
      "piece-fill": page.getByTestId("style-control-piece-fill"),
    };
    this.options = {
      "writing-Hanja": page.getByTestId("style-control-writing-Hanja"),
      "writing-Hangul": page.getByTestId("style-control-writing-Hangul"),
      "glyph-kind-character": page.getByTestId("style-control-glyph-kind-character"),
      "glyph-kind-pictograph": page.getByTestId("style-control-glyph-kind-pictograph"),
      "body-shape-octagon": page.getByTestId("style-control-body-shape-octagon"),
      "body-shape-disc": page.getByTestId("style-control-body-shape-disc"),
    };
    this.drawings = {
      general: page.getByTestId("style-control-pictograph-general"),
      guard: page.getByTestId("style-control-pictograph-guard"),
      horse: page.getByTestId("style-control-pictograph-horse"),
      elephant: page.getByTestId("style-control-pictograph-elephant"),
      chariot: page.getByTestId("style-control-pictograph-chariot"),
      cannon: page.getByTestId("style-control-pictograph-cannon"),
      soldier: page.getByTestId("style-control-pictograph-soldier"),
    };
    this.drawingMessages = {
      general: page.getByTestId("style-control-pictograph-general-message"),
      guard: page.getByTestId("style-control-pictograph-guard-message"),
      horse: page.getByTestId("style-control-pictograph-horse-message"),
      elephant: page.getByTestId("style-control-pictograph-elephant-message"),
      chariot: page.getByTestId("style-control-pictograph-chariot-message"),
      cannon: page.getByTestId("style-control-pictograph-cannon-message"),
      soldier: page.getByTestId("style-control-pictograph-soldier-message"),
    };
  }

  async setColour(styleControlName: StyleControlName, colour: string): Promise<void> {
    await this.inStyles(async () => {
      await this.controls[styleControlName].fill(colour);
    });
  }

  async setNumber(styleControlName: StyleControlName, value: number): Promise<void> {
    await this.inStyles(async () => {
      await this.controls[styleControlName].fill(String(value));
    });
  }

  async getColour(styleControlName: StyleControlName): Promise<string> {
    return await this.controls[styleControlName].inputValue();
  }

  async getNumber(styleControlName: StyleControlName): Promise<number> {
    return Number(await this.controls[styleControlName].inputValue());
  }

  async chooseOption(styleOptionName: StyleOptionName): Promise<void> {
    await this.inStyles(async () => {
      await this.options[styleOptionName].click();
    });
  }

  /** Chooses an SVG file, with this text in it, as the drawing of a kind of piece. */
  async importDrawing(pieceType: PieceType, svg: string): Promise<void> {
    await this.inStyles(async () => {
      await this.drawings[pieceType].setInputFiles({
        name: `${pieceType}.svg`,
        mimeType: "image/svg+xml",
        buffer: Buffer.from(svg),
      });
    });
  }

  /** What the editor said of the last SVG chosen for a kind of piece, or undefined where it took it. */
  async getDrawingMessage(pieceType: PieceType): Promise<string | undefined> {
    if ((await this.drawingMessages[pieceType].count()) === 0) return undefined;

    return (await this.drawingMessages[pieceType].textContent()) ?? undefined;
  }
}

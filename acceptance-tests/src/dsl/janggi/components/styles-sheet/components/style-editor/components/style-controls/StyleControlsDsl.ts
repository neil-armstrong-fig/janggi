import {DslError} from "@src/dsl/errors/DslError";
import type {Page} from "@playwright/test";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import {StyleControlsPlaywright} from "@src/dsl/janggi/components/styles-sheet/components/style-editor/components/style-controls/playwright/StyleControlsPlaywright";
import type {StyleControlName} from "@src/dsl/janggi/components/styles-sheet/components/style-editor/components/style-controls/types/StyleControlName";
import type {StyleOptionName} from "@src/dsl/janggi/components/styles-sheet/components/style-editor/components/style-controls/types/StyleOptionName";

/**
 * Every setting of the style being made, reached as `janggi.stylesSheet.styleEditor.controls` — colours,
 * sliders, the editor's choices, and the SVG files a piece's drawing may be replaced with.
 */
export class StyleControlsDsl {
  private readonly styleControls: StyleControlsPlaywright;

  constructor(page: Page) {
    this.styleControls = new StyleControlsPlaywright(page);
  }

  /** Picks a colour on one of the editor's colour controls, as `#rrggbb`. */
  async setColour(styleControlName: StyleControlName, colour: string): Promise<void> {
    try {
      await this.styleControls.setColour(styleControlName, colour);
    } catch (error) {
      throw new DslError(`Failed to set the ${styleControlName} to ${colour}`, error);
    }
  }

  /** Types a number into one of the editor's sliders. */
  async setNumber(styleControlName: StyleControlName, value: number): Promise<void> {
    try {
      await this.styleControls.setNumber(styleControlName, value);
    } catch (error) {
      throw new DslError(`Failed to set the ${styleControlName} to ${value}`, error);
    }
  }

  /** The colour a control is showing, as `#rrggbb`. */
  async getColour(styleControlName: StyleControlName): Promise<string> {
    try {
      return await this.styleControls.getColour(styleControlName);
    } catch (error) {
      throw new DslError(`Failed to read the ${styleControlName}`, error);
    }
  }

  /** The number a slider is showing. */
  async getNumber(styleControlName: StyleControlName): Promise<number> {
    try {
      return await this.styleControls.getNumber(styleControlName);
    } catch (error) {
      throw new DslError(`Failed to read the ${styleControlName}`, error);
    }
  }

  /** Presses one of the editor's choices — the writing, the kind of mark, the shape of a body. */
  async chooseOption(styleOptionName: StyleOptionName): Promise<void> {
    try {
      await this.styleControls.chooseOption(styleOptionName);
    } catch (error) {
      throw new DslError(`Failed to choose ${styleOptionName}`, error);
    }
  }

  /** Chooses an SVG file, with this text in it, as the drawing of a kind of piece. */
  async importDrawing(pieceType: PieceType, svg: string): Promise<void> {
    try {
      await this.styleControls.importDrawing(pieceType, svg);
    } catch (error) {
      throw new DslError(`Failed to import an SVG for the ${pieceType}`, error);
    }
  }

  /** What the editor said of the last SVG chosen for a kind of piece, or undefined where it took it. */
  async getDrawingMessage(pieceType: PieceType): Promise<string | undefined> {
    try {
      return await this.styleControls.getDrawingMessage(pieceType);
    } catch (error) {
      throw new DslError(`Failed to read what was said of the ${pieceType}'s SVG`, error);
    }
  }
}

import type {BoardPlaywright} from "@src/dsl/janggi/components/board/playwright/BoardPlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";

/**
 * What a test is allowed to say about the board, reached as `janggi.board`.
 *
 * One method per thing a spec needs to ask, each a call into the `BoardPlaywright` beside it,
 * wrapped so a failure names the intention. Anything about the browser the board is viewed in
 * belongs a level up, on `JanggiDsl`.
 *
 * It is handed its counterpart already built, rather than a Playwright `Page`, so there is nothing
 * here to drive the browser with even by accident.
 */
export class BoardDsl {
  constructor(private readonly board: BoardPlaywright) {}

  async isVisible(): Promise<boolean> {
    try {
      return await this.board.isVisible();
    } catch (error) {
      throw new DslError("Failed to check whether the board is visible", error);
    }
  }

  /** Whether the whole board is inside the window, rather than overflowing off an edge of it. */
  async isFullyOnScreen(): Promise<boolean> {
    try {
      return await this.board.isFullyOnScreen();
    } catch (error) {
      throw new DslError("Failed to check whether the whole board is on screen", error);
    }
  }

  async countPieces(): Promise<number> {
    try {
      return await this.board.countPieces();
    } catch (error) {
      throw new DslError("Failed to count the pieces on the board", error);
    }
  }

  /** Which piece stands on an intersection, or undefined where none does. */
  async pieceAt(file: number, rank: number): Promise<Piece | undefined> {
    try {
      return await this.board.pieceAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to read the piece at file ${file}, rank ${rank}`, error);
    }
  }

  /** How wide a piece is drawn, in pixels — the traditional set turns three different sizes. */
  async pieceWidthAt(file: number, rank: number): Promise<number | undefined> {
    try {
      return await this.board.pieceWidthAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to measure the piece at file ${file}, rank ${rank}`, error);
    }
  }

  /** The character painted on a piece, or undefined where the set in use draws pictures instead. */
  async characterAt(file: number, rank: number): Promise<string | undefined> {
    try {
      return await this.board.characterAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to read the character at file ${file}, rank ${rank}`, error);
    }
  }
}

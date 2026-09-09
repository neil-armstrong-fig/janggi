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

  async getPieceCount(): Promise<number> {
    try {
      return await this.board.getPieceCount();
    } catch (error) {
      throw new DslError("Failed to count the pieces on the board", error);
    }
  }

  /** Which piece stands on an intersection, or undefined where none does. */
  async getPieceAt(file: number, rank: number): Promise<Piece | undefined> {
    try {
      return await this.board.getPieceAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to read the piece at file ${file}, rank ${rank}`, error);
    }
  }

  /** Taps an intersection, the way a player does — to pick a piece up, or to put it down. */
  async tap(file: number, rank: number): Promise<void> {
    try {
      await this.board.tap(file, rank);
    } catch (error) {
      throw new DslError(`Failed to tap file ${file}, rank ${rank}`, error);
    }
  }

  /** Rests the pointer on an intersection without tapping it. */
  async hover(file: number, rank: number): Promise<void> {
    try {
      await this.board.hover(file, rank);
    } catch (error) {
      throw new DslError(`Failed to hover file ${file}, rank ${rank}`, error);
    }
  }

  /** Whether the piece on an intersection is the one currently picked up. */
  async isSelected(file: number, rank: number): Promise<boolean> {
    try {
      return await this.board.isSelected(file, rank);
    } catch (error) {
      throw new DslError(`Failed to check whether file ${file}, rank ${rank} is selected`, error);
    }
  }

  /** Whether the board is offering this intersection as somewhere the selected piece may go. */
  async canMoveTo(file: number, rank: number): Promise<boolean> {
    try {
      return await this.board.canMoveTo(file, rank);
    } catch (error) {
      throw new DslError(`Failed to check whether file ${file}, rank ${rank} is a legal move`, error);
    }
  }

  /**
   * Whether the board is marking the piece on this intersection as one its owner may move now.
   *
   * Not to be confused with `canMoveTo`, which asks about a destination for the piece already in
   * hand. This asks about the piece standing here, and is answered for the army whose turn it is.
   */
  async canBeMoved(file: number, rank: number): Promise<boolean> {
    try {
      return await this.board.canBeMoved(file, rank);
    } catch (error) {
      throw new DslError(`Failed to check whether the piece at file ${file}, rank ${rank} can be moved`, error);
    }
  }

  /** How wide a piece is drawn, in pixels — the traditional set turns three different sizes. */
  async getPieceWidthAt(file: number, rank: number): Promise<number | undefined> {
    try {
      return await this.board.getPieceWidthAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to measure the piece at file ${file}, rank ${rank}`, error);
    }
  }

  /** The character painted on a piece, or undefined where the set in use draws pictures instead. */
  async getCharacterAt(file: number, rank: number): Promise<string | undefined> {
    try {
      return await this.board.getCharacterAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to read the character at file ${file}, rank ${rank}`, error);
    }
  }
}

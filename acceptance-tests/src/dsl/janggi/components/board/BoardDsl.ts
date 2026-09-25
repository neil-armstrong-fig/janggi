import type {MarkedMove} from "@src/dsl/janggi/components/board/playwright/BoardPlaywright";
import type {Page} from "@playwright/test";
import {BoardPlaywright} from "@src/dsl/janggi/components/board/playwright/BoardPlaywright";
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
  private readonly board: BoardPlaywright;

  constructor(page: Page) {
    this.board = new BoardPlaywright(page);
  }

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

  /** Whether the pieces are turned to face Han's player, sat across the device, with the board itself left where it is. */
  async isFlippedForHan(): Promise<boolean> {
    try {
      return await this.board.isFlippedForHan();
    } catch (error) {
      throw new DslError("Failed to check whether the board is flipped for Han", error);
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
   * Whether the board is showing this intersection as one the piece in question would land on, were a
   * piece of its own army not already standing there. Never also a move — `canMoveTo` answers no.
   */
  async isShownAsCovered(file: number, rank: number): Promise<boolean> {
    try {
      return await this.board.isShownAsCovered(file, rank);
    } catch (error) {
      throw new DslError(`Failed to check whether file ${file}, rank ${rank} is shown as covered`, error);
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

  /** The colour the lines of an intersection are drawn in, as the browser resolves it — `rgb(…)`. */
  async getLineColourAt(file: number, rank: number): Promise<string> {
    try {
      return await this.board.getLineColourAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to read the colour of the lines at file ${file}, rank ${rank}`, error);
    }
  }

  /** The board's own background behind a rank, as the browser resolves it — Han's half, or Cho's. */
  async getSurfaceAt(rank: number): Promise<string> {
    try {
      return await this.board.getSurfaceAt(rank);
    } catch (error) {
      throw new DslError(`Failed to read the board's background at rank ${rank}`, error);
    }
  }

  /** The colour the line down the open file is drawn in, as the browser resolves it, or undefined with no bikjang called. */
  async getBikjangLineColour(): Promise<string | undefined> {
    try {
      return await this.board.getBikjangLineColour();
    } catch (error) {
      throw new DslError("Failed to read the colour of the bikjang line", error);
    }
  }

  /** How thick, in pixels, the line down the open file is drawn, or undefined with no bikjang called. */
  async getBikjangLineWidth(): Promise<number | undefined> {
    try {
      return await this.board.getBikjangLineWidth();
    } catch (error) {
      throw new DslError("Failed to read the thickness of the bikjang line", error);
    }
  }

  /** The colour the lines of a check are drawn in, as the browser resolves it, or undefined with no check. */
  async getCheckLineColour(): Promise<string | undefined> {
    try {
      return await this.board.getCheckLineColour();
    } catch (error) {
      throw new DslError("Failed to read the colour of the check lines", error);
    }
  }

  /** The colour of the dot marking a point the piece in hand may move to, as the browser resolves it. */
  async getMoveHintColourAt(file: number, rank: number): Promise<string> {
    try {
      return await this.board.getMoveHintColourAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to read the colour of the move hint at file ${file}, rank ${rank}`, error);
    }
  }

  /** The colour washed over the point of the piece in hand, as the browser resolves it. */
  async getSelectionColourAt(file: number, rank: number): Promise<string> {
    try {
      return await this.board.getSelectionColourAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to read the colour of the piece in hand's wash at file ${file}, rank ${rank}`, error);
    }
  }

  /** How thick the outline of a piece's body is drawn — thicker under the pointer. */
  async getPieceOutlineWidthAt(file: number, rank: number): Promise<number> {
    try {
      return await this.board.getPieceOutlineWidthAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to measure the outline of the piece at file ${file}, rank ${rank}`, error);
    }
  }

  /** The shadow cast under a piece drawn raised off the board, as the browser resolves it. */
  async getHeldShadowAt(file: number, rank: number): Promise<string> {
    try {
      return await this.board.getHeldShadowAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to read the shadow of the piece at file ${file}, rank ${rank}`, error);
    }
  }

  /** Whether the intersection is marked as the point the last move left. */
  async isMarkedAsMovedFrom(file: number, rank: number): Promise<boolean> {
    try {
      return await this.board.isMarkedAsMovedFrom(file, rank);
    } catch (error) {
      throw new DslError(`Failed to check whether file ${file}, rank ${rank} is marked as moved from`, error);
    }
  }

  /** Whether the intersection is marked as the point the last move arrived on. */
  async isMarkedAsMovedTo(file: number, rank: number): Promise<boolean> {
    try {
      return await this.board.isMarkedAsMovedTo(file, rank);
    } catch (error) {
      throw new DslError(`Failed to check whether file ${file}, rank ${rank} is marked as moved to`, error);
    }
  }

  /** The move the board marks as the last one, or undefined where the last turn was not a move. */
  async getLastMove(): Promise<MarkedMove | undefined> {
    try {
      return await this.board.getLastMove();
    } catch (error) {
      throw new DslError("Failed to read the last move off the board", error);
    }
  }

  /** Whether the intersection is marked as a general under attack. */
  async isMarkedAsUnderAttack(file: number, rank: number): Promise<boolean> {
    try {
      return await this.board.isMarkedAsUnderAttack(file, rank);
    } catch (error) {
      throw new DslError(`Failed to check whether file ${file}, rank ${rank} is marked as under attack`, error);
    }
  }

  /** Whether the intersection is marked as holding a piece that is giving check. */
  async isMarkedAsAttacking(file: number, rank: number): Promise<boolean> {
    try {
      return await this.board.isMarkedAsAttacking(file, rank);
    } catch (error) {
      throw new DslError(`Failed to check whether file ${file}, rank ${rank} is marked as attacking`, error);
    }
  }

  /** Whether the intersection is marked as a move that would let a bikjang be called. */
  async isMarkedAsBikjangRisk(file: number, rank: number): Promise<boolean> {
    try {
      return await this.board.isMarkedAsBikjangRisk(file, rank);
    } catch (error) {
      throw new DslError(`Failed to check whether file ${file}, rank ${rank} is marked as a bikjang risk`, error);
    }
  }

  /** Whether the piece on an intersection is drawn raised off the board, as a piece in hand is. */
  async isPieceRaisedAt(file: number, rank: number): Promise<boolean> {
    try {
      return await this.board.isPieceRaisedAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to check whether the piece at file ${file}, rank ${rank} is raised`, error);
    }
  }

  /** Whether a piece is shown travelling over the board. Only ever yes with motion left on. */
  async isShowingAPieceInFlight(): Promise<boolean> {
    try {
      return await this.board.isShowingAPieceInFlight();
    } catch (error) {
      throw new DslError("Failed to check whether a piece is shown in flight", error);
    }
  }

  /** Whether a capture is shown landing. Only ever yes with motion left on. */
  async isShowingAnImpact(): Promise<boolean> {
    try {
      return await this.board.isShowingAnImpact();
    } catch (error) {
      throw new DslError("Failed to check whether a capture is shown landing", error);
    }
  }

  /** Whether the piece on an intersection is fully shown once any motion over it has settled. */
  async isPieceFullyShownAt(file: number, rank: number): Promise<boolean> {
    try {
      return await this.board.isPieceFullyShownAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to check whether the piece at file ${file}, rank ${rank} is fully shown`, error);
    }
  }

  /** Whether nothing is left drawn over the board once motion has settled. */
  async isClearOfMotion(): Promise<boolean> {
    try {
      return await this.board.isClearOfMotion();
    } catch (error) {
      throw new DslError("Failed to check whether the board is clear of motion", error);
    }
  }

  /** Whether the board is being shaken. */
  async isBeingShaken(): Promise<boolean> {
    try {
      return await this.board.isBeingShaken();
    } catch (error) {
      throw new DslError("Failed to check whether the board is being shaken", error);
    }
  }

  /** Whether the board has come back to rest exactly where it belongs. */
  async isAtRest(): Promise<boolean> {
    try {
      return await this.board.isAtRest();
    } catch (error) {
      throw new DslError("Failed to check whether the board is at rest", error);
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

import {BoardPeekPlaywright} from "@src/dsl/janggi/components/status/components/board-overlay/components/board-peek/playwright/BoardPeekPlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import type {Page} from "@playwright/test";

/**
 * The board looked at with the result put aside, reached as `janggi.status.overlay.boardPeek`.
 */
export class BoardPeekDsl {
  private readonly boardPeek: BoardPeekPlaywright;

  constructor(page: Page) {
    this.boardPeek = new BoardPeekPlaywright(page);
  }

  /** Taps the board while the result is put aside. */
  async tapTheBoardToSeeTheResult(): Promise<void> {
    try {
      await this.boardPeek.tapTheBoardToSeeTheResult();
    } catch (error) {
      throw new DslError("Failed to tap the board to see the result again", error);
    }
  }

  /** Whether the settings, once opened, stand over the board's tap back to the result rather than under it. */
  async isUnderTheSettings(): Promise<boolean> {
    try {
      return await this.boardPeek.isUnderTheSettings();
    } catch (error) {
      throw new DslError("Failed to check whether the settings stand over the board's tap", error);
    }
  }

  /** Whether the result is put aside, and the board being looked at. */
  async isBoardShown(): Promise<boolean> {
    try {
      return await this.boardPeek.isBoardShown();
    } catch (error) {
      throw new DslError("Failed to check whether the board is shown", error);
    }
  }
}

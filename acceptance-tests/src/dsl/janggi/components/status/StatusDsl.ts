import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {StatusPlaywright} from "@src/dsl/janggi/components/status/playwright/StatusPlaywright";

/**
 * What the game says about itself, reached as `janggi.status`.
 *
 * Its own member rather than part of `board` or `settings`: whose turn it is belongs to neither the
 * pieces nor the controls. Whatever else the game reports about itself — a score, what has been
 * taken — belongs here too.
 */
export class StatusDsl {
  private readonly status: StatusPlaywright;

  constructor(page: Page) {
    this.status = new StatusPlaywright(page);
  }

  /**
   * Whether the board is still being laid out rather than played — the scored game's 판차림 phase,
   * in which Han arranges first and Cho answers. `getTurn` says which army it is waiting on.
   */
  async isLayingOut(): Promise<boolean> {
    try {
      return await this.status.isLayingOut();
    } catch (error) {
      throw new DslError("Failed to read whether the board is still being laid out", error);
    }
  }

  /** Whether the army to move is in check. */
  async isInCheck(): Promise<boolean> {
    try {
      return await this.status.isInCheck();
    } catch (error) {
      throw new DslError("Failed to read whether the army to move is in check", error);
    }
  }

  /** The army that has won, or undefined while the game is still being played. */
  async getWinner(): Promise<Side | undefined> {
    try {
      return await this.status.getWinner();
    } catch (error) {
      throw new DslError("Failed to read which army has won", error);
    }
  }

  /** Rests the turn — 한수쉼 — playing nothing and handing the move to the other army. */
  async pass(): Promise<void> {
    try {
      await this.status.pass();
    } catch (error) {
      throw new DslError("Failed to rest the turn", error);
    }
  }

  /** Whether the army to move may rest the turn, rather than being obliged to play something. */
  async canPass(): Promise<boolean> {
    try {
      return await this.status.canPass();
    } catch (error) {
      throw new DslError("Failed to read whether the turn may be rested", error);
    }
  }

  /** Calls the bikjang the two generals are standing in — 빅장, which stops the game. */
  async callBikjang(): Promise<void> {
    try {
      await this.status.callBikjang();
    } catch (error) {
      throw new DslError("Failed to call the bikjang", error);
    }
  }

  /** Whether there is a bikjang on the board that this format lets the players call. */
  async canCallBikjang(): Promise<boolean> {
    try {
      return await this.status.canCallBikjang();
    } catch (error) {
      throw new DslError("Failed to read whether a bikjang may be called", error);
    }
  }

  /** Whether the game ended in a draw. */
  async isDrawn(): Promise<boolean> {
    try {
      return await this.status.isDrawn();
    } catch (error) {
      throw new DslError("Failed to read whether the game was drawn", error);
    }
  }

  /** Takes the last thing played back, whether that was a move or a rested turn. */
  async undo(): Promise<void> {
    try {
      await this.status.undo();
    } catch (error) {
      throw new DslError("Failed to take the last turn back", error);
    }
  }

  /** Whether there is anything to take back. */
  async canUndo(): Promise<boolean> {
    try {
      return await this.status.canUndo();
    } catch (error) {
      throw new DslError("Failed to read whether there is anything to take back", error);
    }
  }

  /** Plays again the turn that was most recently taken back. */
  async redo(): Promise<void> {
    try {
      await this.status.redo();
    } catch (error) {
      throw new DslError("Failed to play the turn that was taken back again", error);
    }
  }

  /** Whether anything taken back is waiting to be played again. */
  async canRedo(): Promise<boolean> {
    try {
      return await this.status.canRedo();
    } catch (error) {
      throw new DslError("Failed to read whether there is anything to play again", error);
    }
  }

  /** What one army is worth in points, Han's 덤 counted in. */
  async getScore(side: Side): Promise<number> {
    try {
      return await this.status.getScore(side);
    } catch (error) {
      throw new DslError(`Failed to read ${side}'s score`, error);
    }
  }

  /** Which army is to move. */
  async getTurn(): Promise<Side | undefined> {
    try {
      return await this.status.getTurn();
    } catch (error) {
      throw new DslError("Failed to read whose turn it is", error);
    }
  }

  /** Every piece one army has lost, by kind, in the order pieces are named — the general first. */
  async getTakenFrom(side: Side): Promise<PieceType[]> {
    try {
      return await this.status.getTakenFrom(side);
    } catch (error) {
      throw new DslError(`Failed to read what ${side} has lost`, error);
    }
  }

  /** Deals a fresh game from the announcement of the last one's result. */
  async startNewGame(): Promise<void> {
    try {
      await this.status.startNewGame();
    } catch (error) {
      throw new DslError("Failed to start a new game from the result", error);
    }
  }

  /** Whether the end of the game is announced over the board. */
  async isResultAnnounced(): Promise<boolean> {
    try {
      return await this.status.isResultAnnounced();
    } catch (error) {
      throw new DslError("Failed to check whether a result is announced", error);
    }
  }

  /** The score an army is shown with once it has finished rolling to its new value. */
  async getShownScore(side: Side): Promise<number> {
    try {
      return await this.status.getShownScore(side);
    } catch (error) {
      throw new DslError(`Failed to read the score ${side} is shown with`, error);
    }
  }
}

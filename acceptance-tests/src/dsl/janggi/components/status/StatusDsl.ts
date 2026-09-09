import {DslError} from "@src/dsl/errors/DslError";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {StatusPlaywright} from "@src/dsl/janggi/components/status/playwright/StatusPlaywright";

/**
 * What the game says about itself, reached as `janggi.status`.
 *
 * Its own member rather than part of `board` or `settings`: whose turn it is belongs to neither the
 * pieces nor the controls. Whatever else the game reports about itself — a score, what has been
 * taken — belongs here too.
 */
export class StatusDsl {
  constructor(private readonly status: StatusPlaywright) {}

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

  /** Deals a fresh game, abandoning whatever was being played. */
  async startNewGame(): Promise<void> {
    try {
      await this.status.startNewGame();
    } catch (error) {
      throw new DslError("Failed to start a new game", error);
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
}

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

  /** Which army is to move. */
  async getTurn(): Promise<Side | undefined> {
    try {
      return await this.status.getTurn();
    } catch (error) {
      throw new DslError("Failed to read whose turn it is", error);
    }
  }
}

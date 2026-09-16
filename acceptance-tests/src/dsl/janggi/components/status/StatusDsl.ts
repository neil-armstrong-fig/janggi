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

  /**
   * Waits while it is the bot's turn — to lay out or to move — and returns once it has played. Returns
   * at once when the bot is not the one being waited on.
   */
  async waitForTheBot(): Promise<void> {
    try {
      await this.status.waitForTheBot();
    } catch (error) {
      throw new DslError("Failed to wait for the bot to play", error);
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

  /** Lets as long pass as the bot would take to open, for a spec claiming it has not. */
  async giveTheBotTimeToOpen(): Promise<void> {
    try {
      await this.status.giveTheBotTimeToOpen();
    } catch (error) {
      throw new DslError("Failed to wait as long as the bot takes to open", error);
    }
  }

  /** Lets the bot make the first move of the game, which it holds until the player says so. */
  async letTheBotStart(): Promise<void> {
    try {
      await this.status.letTheBotStart();
    } catch (error) {
      throw new DslError("Failed to let the bot start the game", error);
    }
  }

  /** Whether the bot is holding the game's first move until the player lets it start. */
  async isWaitingToLetTheBotStart(): Promise<boolean> {
    try {
      return await this.status.isWaitingToLetTheBotStart();
    } catch (error) {
      throw new DslError("Failed to read whether the bot is waiting to be let start", error);
    }
  }

  /** Whether an army is marked as played by the bot. */
  async isMarkedAsTheBot(side: Side): Promise<boolean> {
    try {
      return await this.status.isMarkedAsTheBot(side);
    } catch (error) {
      throw new DslError(`Failed to read whether ${side} is marked as the bot's`, error);
    }
  }

  /** Whether an army is marked as the player's own, against the bot. */
  async isMarkedAsThePlayer(side: Side): Promise<boolean> {
    try {
      return await this.status.isMarkedAsThePlayer(side);
    } catch (error) {
      throw new DslError(`Failed to read whether ${side} is marked as the player's`, error);
    }
  }

  /** The rating shown beside an army — the bot's strength or the player's Elo — or undefined where none is. */
  async getShownRating(side: Side): Promise<number | undefined> {
    try {
      return await this.status.getShownRating(side);
    } catch (error) {
      throw new DslError(`Failed to read the rating shown beside ${side}`, error);
    }
  }

  /** The XP shown beside an army, or undefined where none is — the bot's plaque, or a game between two people. */
  async getShownXp(side: Side): Promise<number | undefined> {
    try {
      return await this.status.getShownXp(side);
    } catch (error) {
      throw new DslError(`Failed to read the XP shown beside ${side}`, error);
    }
  }

  /** The next unlock shown beside the player's XP, or undefined once everything is open. */
  async getNextUnlock(side: Side): Promise<string | undefined> {
    try {
      return await this.status.getNextUnlock(side);
    } catch (error) {
      throw new DslError(`Failed to read the next unlock shown beside ${side}`, error);
    }
  }

  /** The army the announced result says called a bikjang, or undefined where no bikjang is explained. */
  async getBikjangCaller(): Promise<Side | undefined> {
    try {
      return await this.status.getBikjangCaller();
    } catch (error) {
      throw new DslError("Failed to read who the result says called the bikjang", error);
    }
  }

  /** Whether the board explains that a move repeating the position is being held back. */
  async isRepetitionExplained(): Promise<boolean> {
    try {
      return await this.status.isRepetitionExplained();
    } catch (error) {
      throw new DslError("Failed to read whether the repetition rule is explained", error);
    }
  }
}

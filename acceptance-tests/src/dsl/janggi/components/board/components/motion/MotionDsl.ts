import {MotionPlaywright} from "@src/dsl/janggi/components/board/components/motion/playwright/MotionPlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import type {Page} from "@playwright/test";

/**
 * What the board is doing rather than what stands on it, reached as `janggi.board.motion`: a piece lifted, in flight,
 * landing or settling, and the board shaking — what the effects specs ask, and what waits for a move to have finished.
 */
export class MotionDsl {
  private readonly motion: MotionPlaywright;

  constructor(page: Page) {
    this.motion = new MotionPlaywright(page);
  }

  /** Whether the piece on an intersection is drawn raised off the board, as a piece in hand is. */
  async isPieceRaisedAt(file: number, rank: number): Promise<boolean> {
    try {
      return await this.motion.isPieceRaisedAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to check whether the piece at file ${file}, rank ${rank} is raised`, error);
    }
  }

  /** Whether a piece is shown travelling over the board. Only ever yes with motion left on. */
  async isShowingAPieceInFlight(): Promise<boolean> {
    try {
      return await this.motion.isShowingAPieceInFlight();
    } catch (error) {
      throw new DslError("Failed to check whether a piece is shown in flight", error);
    }
  }

  /** Whether a capture is shown landing. Only ever yes with motion left on. */
  async isShowingAnImpact(): Promise<boolean> {
    try {
      return await this.motion.isShowingAnImpact();
    } catch (error) {
      throw new DslError("Failed to check whether a capture is shown landing", error);
    }
  }

  /** Whether the piece on an intersection is fully shown once any motion over it has settled. */
  async isPieceFullyShownAt(file: number, rank: number): Promise<boolean> {
    try {
      return await this.motion.isPieceFullyShownAt(file, rank);
    } catch (error) {
      throw new DslError(`Failed to check whether the piece at file ${file}, rank ${rank} is fully shown`, error);
    }
  }

  /** Whether nothing is left drawn over the board once motion has settled. */
  async isClearOfMotion(): Promise<boolean> {
    try {
      return await this.motion.isClearOfMotion();
    } catch (error) {
      throw new DslError("Failed to check whether the board is clear of motion", error);
    }
  }

  /** Whether the board is being shaken. */
  async isBeingShaken(): Promise<boolean> {
    try {
      return await this.motion.isBeingShaken();
    } catch (error) {
      throw new DslError("Failed to check whether the board is being shaken", error);
    }
  }

  /** Whether the board has come back to rest exactly where it belongs. */
  async isAtRest(): Promise<boolean> {
    try {
      return await this.motion.isAtRest();
    } catch (error) {
      throw new DslError("Failed to check whether the board is at rest", error);
    }
  }
}

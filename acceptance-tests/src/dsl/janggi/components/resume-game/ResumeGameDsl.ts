import type {ClockReading} from "@src/dsl/janggi/components/types/ClockReading";
import {DslError} from "@src/dsl/errors/DslError";
import type {Page} from "@playwright/test";
import {ResumeGamePlaywright} from "@src/dsl/janggi/components/resume-game/playwright/ResumeGamePlaywright";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** The dialog a clocked game comes back to after a reload, reached as `janggi.resumeGame`. */
export class ResumeGameDsl {
  private readonly resumeGame: ResumeGamePlaywright;

  constructor(page: Page) {
    this.resumeGame = new ResumeGamePlaywright(page);
  }

  async isShown(): Promise<boolean> {
    try {
      return await this.resumeGame.isShown();
    } catch (error) {
      throw new DslError("Failed to read whether the resume dialog is up", error);
    }
  }

  async getPlayerToMove(): Promise<Side> {
    try {
      return await this.resumeGame.getPlayerToMove();
    } catch (error) {
      throw new DslError("Failed to read who the resume dialog names", error);
    }
  }

  async isTurnedToFaceHan(): Promise<boolean> {
    try {
      return await this.resumeGame.isTurnedToFaceHan();
    } catch (error) {
      throw new DslError("Failed to read which way the resume dialog faces", error);
    }
  }

  /** What the dialog shows of an army's time, as a plaque's clock is read. */
  async getClock(side: Side): Promise<ClockReading> {
    try {
      return await this.resumeGame.getClock(side);
    } catch (error) {
      throw new DslError(`Failed to read ${side}'s time in the resume dialog`, error);
    }
  }

  async isTextSelectable(): Promise<boolean> {
    try {
      return await this.resumeGame.isTextSelectable();
    } catch (error) {
      throw new DslError("Failed to read whether the resume dialog's words can be selected", error);
    }
  }

  async resume(): Promise<void> {
    try {
      await this.resumeGame.resume();
    } catch (error) {
      throw new DslError("Failed to press Resume", error);
    }
  }
}

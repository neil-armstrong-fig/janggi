import {ResultBannerPlaywright} from "@src/dsl/janggi/components/status/components/board-overlay/components/result-banner/playwright/ResultBannerPlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {Page} from "@playwright/test";

/**
 * The announcement of a game's result over the board, reached as `janggi.status.overlay.resultBanner`: what it says, and
 * the next game it offers.
 */
export class ResultBannerDsl {
  private readonly resultBanner: ResultBannerPlaywright;

  constructor(page: Page) {
    this.resultBanner = new ResultBannerPlaywright(page);
  }

  /** Deals a fresh game from the announcement of the last one's result. */
  async startNewGame(): Promise<void> {
    try {
      await this.resultBanner.startNewGame();
    } catch (error) {
      throw new DslError("Failed to start a new game from the result", error);
    }
  }

  /** Puts the announcement aside to look at the board beneath it. */
  async showBoard(): Promise<void> {
    try {
      await this.resultBanner.showBoard();
    } catch (error) {
      throw new DslError("Failed to put the result aside and show the board", error);
    }
  }

  /** Deals a fresh game against the strength of bot the last one's win opened, from the announcement. */
  async startNewGameAtNextStrength(): Promise<void> {
    try {
      await this.resultBanner.startNewGameAtNextStrength();
    } catch (error) {
      throw new DslError("Failed to start a new game at the next strength from the result", error);
    }
  }

  /** Whether the announcement offers a game against the strength of bot the win opened. */
  async isNewGameAtNextStrengthOffered(): Promise<boolean> {
    try {
      return await this.resultBanner.isNewGameAtNextStrengthOffered();
    } catch (error) {
      throw new DslError("Failed to check whether a new game at the next strength is offered", error);
    }
  }

  /** Whether the end of the game is announced over the board. */
  async isResultAnnounced(): Promise<boolean> {
    try {
      return await this.resultBanner.isResultAnnounced();
    } catch (error) {
      throw new DslError("Failed to check whether a result is announced", error);
    }
  }

  /** Whether the settings, once opened, stand over the announcement rather than under it. */
  async isUnderTheSettings(): Promise<boolean> {
    try {
      return await this.resultBanner.isUnderTheSettings();
    } catch (error) {
      throw new DslError("Failed to check whether the settings stand over the result", error);
    }
  }

  /** Whether the announcement offers New game, which the tutorial's does not: there is no game of its own to deal next. */
  async isNewGameOffered(): Promise<boolean> {
    try {
      return await this.resultBanner.isNewGameOffered();
    } catch (error) {
      throw new DslError("Failed to check whether the result offers a new game", error);
    }
  }

  /** How full the XP bar on the announced result is, in whole percent, or undefined where none is drawn. */
  async getResultXpBarPercent(): Promise<number | undefined> {
    try {
      return await this.resultBanner.getResultXpBarPercent();
    } catch (error) {
      throw new DslError("Failed to read how full the XP bar on the result is", error);
    }
  }

  /** The army the announced result says called a bikjang, or undefined where no bikjang is explained. */
  async getBikjangCaller(): Promise<Side | undefined> {
    try {
      return await this.resultBanner.getBikjangCaller();
    } catch (error) {
      throw new DslError("Failed to read who the result says called the bikjang", error);
    }
  }
}

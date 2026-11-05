import {DrawOfferPlaywright} from "@src/dsl/janggi/components/status/components/board-overlay/components/draw-offer/playwright/DrawOfferPlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {Page} from "@playwright/test";

/**
 * The question over the board once a draw has been offered, reached as `janggi.status.overlay.drawOffer`.
 */
export class DrawOfferDsl {
  private readonly drawOffer: DrawOfferPlaywright;

  constructor(page: Page) {
    this.drawOffer = new DrawOfferPlaywright(page);
  }

  /** What the question over the board says, once a draw has been offered. */
  async getDrawOfferLine(): Promise<string> {
    try {
      return await this.drawOffer.getDrawOfferLine();
    } catch (error) {
      throw new DslError("Failed to read what the draw offer says", error);
    }
  }

  /** The army whose offer of a draw is waiting for an answer, or undefined where none is. */
  async getDrawOfferedBy(): Promise<Side | undefined> {
    try {
      return await this.drawOffer.getDrawOfferedBy();
    } catch (error) {
      throw new DslError("Failed to read who has offered a draw", error);
    }
  }

  /** Accepts the draw on offer. */
  async acceptDraw(): Promise<void> {
    try {
      await this.drawOffer.acceptDraw();
    } catch (error) {
      throw new DslError("Failed to accept the draw", error);
    }
  }

  /** Declines the draw on offer. */
  async declineDraw(): Promise<void> {
    try {
      await this.drawOffer.declineDraw();
    } catch (error) {
      throw new DslError("Failed to decline the draw", error);
    }
  }
}

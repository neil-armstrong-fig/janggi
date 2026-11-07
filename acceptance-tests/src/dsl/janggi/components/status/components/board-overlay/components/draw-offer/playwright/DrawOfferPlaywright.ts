import type {Locator, Page} from "@playwright/test";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";

/**
 * The locators behind `DrawOfferDsl` — the question over the board once a draw has been offered.
 */
export class DrawOfferPlaywright extends BaseComponent {
  private readonly drawOffer: Locator;
  private readonly drawAccept: Locator;
  private readonly drawDecline: Locator;
  private readonly drawOfferLine: Locator;

  constructor(page: Page) {
    super(page);

    this.drawOffer = page.getByTestId("draw-offer");
    this.drawAccept = page.getByTestId("draw-accept");
    this.drawDecline = page.getByTestId("draw-decline");

    this.drawOfferLine = this.page.getByTestId("draw-offer-line");
  }

  /** What the question over the board says, once a draw has been offered. */
  async getDrawOfferLine(): Promise<string> {
    return ((await this.drawOfferLine.textContent()) ?? "").trim();
  }

  /** The army whose offer the question over the board says is waiting, or undefined where there is none. */
  async getDrawOfferedBy(): Promise<Side | undefined> {
    if ((await this.drawOffer.count()) === 0) return undefined;

    const offeredBy = await this.drawOffer.getAttribute("data-offered-by");

    return SIDES.find(candidate => candidate === offeredBy);
  }

  async acceptDraw(): Promise<void> {
    await this.drawAccept.click();
  }

  async declineDraw(): Promise<void> {
    await this.drawDecline.click();
  }
}

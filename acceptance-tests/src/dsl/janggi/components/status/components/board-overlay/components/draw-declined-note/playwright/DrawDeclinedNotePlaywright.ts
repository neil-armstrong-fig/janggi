import type {Locator, Page} from "@playwright/test";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";

const BOT_REPLIES_WITHIN_MS = 20_000;

/**
 * The locators behind `DrawDeclinedNoteDsl` — the note over the board that a draw was turned down.
 */
export class DrawDeclinedNotePlaywright extends BaseComponent {
  private readonly drawDeclined: Locator;

  constructor(page: Page) {
    super(page);

    this.drawDeclined = page.getByTestId("draw-declined");
  }

  /**
   * The army the note over the board says turned a draw down, once it appears — the bot's answer comes
   * a moment after the offer, so this waits for it. Undefined where no refusal is reported by then.
   */
  async getDrawDeclinedBy(): Promise<Side | undefined> {
    const reported = await this.drawDeclined.waitFor({state: "visible", timeout: BOT_REPLIES_WITHIN_MS}).then(
      () => true,
      () => false,
    );
    if (!reported) return undefined;

    const declinedBy = await this.drawDeclined.getAttribute("data-declined-by");

    return SIDES.find(candidate => candidate === declinedBy);
  }
}

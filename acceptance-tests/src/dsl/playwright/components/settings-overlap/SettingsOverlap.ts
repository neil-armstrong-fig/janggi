import type {Locator, Page} from "@playwright/test";

/** The actual overlap of a board element with the settings layer drawn above it. */
export class SettingsOverlap {
  private readonly settings: Locator;
  private readonly element: Locator;

  constructor(page: Page, element: Locator) {
    this.settings = page.getByTestId("settings");
    this.element = element;
  }

  async isUnderTheSettings(): Promise<boolean> {
    const own = (await this.element.boundingBox()) ?? undefined;
    const sheet = (await this.settings.boundingBox()) ?? undefined;
    if (own === undefined || sheet === undefined) return false;

    const left = Math.max(own.x, sheet.x);
    const right = Math.min(own.x + own.width, sheet.x + sheet.width);
    const top = Math.max(own.y, sheet.y);
    const bottom = Math.min(own.y + own.height, sheet.y + sheet.height);
    if (left >= right || top >= bottom) return false;

    return await this.settings.page().evaluate(
      ({x, y}) => {
        return document.elementFromPoint(x, y)?.closest("[data-testid='settings']") != null;
      },
      {x: (left + right) / 2, y: (top + bottom) / 2},
    );
  }
}

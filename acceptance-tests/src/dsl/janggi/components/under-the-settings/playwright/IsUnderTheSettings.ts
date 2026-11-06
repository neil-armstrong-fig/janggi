import type {Locator, Page} from "@playwright/test";

/**
 * Whether the open settings sheet is what is drawn at the middle of where it and `element` overlap — the sheet over what
 * stands on the board (its announcements, the tutorial's card), not under it. False where they do not overlap at all, or where the element is not there, so a
 * spec cannot pass by the two missing each other.
 */
export async function isUnderTheSettings(page: Page, element: Locator): Promise<boolean> {
  const own = await element.boundingBox();
  const sheet = await page.getByTestId("settings").boundingBox();
  if (own === null || sheet === null) return false;

  const left = Math.max(own.x, sheet.x);
  const right = Math.min(own.x + own.width, sheet.x + sheet.width);
  const top = Math.max(own.y, sheet.y);
  const bottom = Math.min(own.y + own.height, sheet.y + sheet.height);
  if (left >= right || top >= bottom) return false;

  return await page.evaluate(
    ({x, y}) => {
      return document.elementFromPoint(x, y)?.closest("[data-testid='settings']") != null;
    },
    {x: (left + right) / 2, y: (top + bottom) / 2},
  );
}

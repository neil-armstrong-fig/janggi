import {errors} from "@playwright/test";
import type {Locator} from "@playwright/test";
import type {AppearanceOptions} from "@src/dsl/playwright/visibility/types/AppearanceOptions";

/** An absent element is false; a broken page must still fail the calling DSL operation. */
export async function appearsWithin(locator: Locator, appearanceOptions: AppearanceOptions = {}): Promise<boolean> {
  try {
    await locator.waitFor(appearanceOptions);
    return true;
  } catch (error) {
    if (error instanceof errors.TimeoutError) return false;
    throw error;
  }
}

import type {Page} from "@playwright/test";

/** A whole screen. Put helpers wanted on every page here. */
export abstract class BasePage {
  protected constructor(protected page: Page) {}
}

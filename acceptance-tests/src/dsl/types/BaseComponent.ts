import type {Page} from "@playwright/test";

/** A piece of a screen. Put helpers wanted on every component here. */
export abstract class BaseComponent {
  protected constructor(protected page: Page) {}
}

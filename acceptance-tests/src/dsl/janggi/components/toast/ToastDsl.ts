import {DslError} from "@src/dsl/errors/DslError";
import type {Page} from "@playwright/test";
import {ToastPlaywright} from "@src/dsl/janggi/components/toast/playwright/ToastPlaywright";

/** A brief message over the page that goes by itself, reached as `janggi.toast`. */
export class ToastDsl {
  private readonly toast: ToastPlaywright;

  constructor(page: Page) {
    this.toast = new ToastPlaywright(page);
  }

  /** What the toast says, or undefined where none is up. */
  async getWords(): Promise<string | undefined> {
    try {
      return await this.toast.getWords();
    } catch (error) {
      throw new DslError("Failed to read the toast", error);
    }
  }
}

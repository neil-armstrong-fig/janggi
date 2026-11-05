import {RepetitionNoticePlaywright} from "@src/dsl/janggi/components/status/components/board-overlay/components/repetition-notice/playwright/RepetitionNoticePlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import type {Page} from "@playwright/test";

/**
 * The note over the board that a move repeating the position is held back, reached as
 * `janggi.status.overlay.repetitionNotice`.
 */
export class RepetitionNoticeDsl {
  private readonly repetitionNotice: RepetitionNoticePlaywright;

  constructor(page: Page) {
    this.repetitionNotice = new RepetitionNoticePlaywright(page);
  }

  /** Whether the board explains that a move repeating the position is being held back. */
  async isRepetitionExplained(): Promise<boolean> {
    try {
      return await this.repetitionNotice.isRepetitionExplained();
    } catch (error) {
      throw new DslError("Failed to read whether the repetition rule is explained", error);
    }
  }
}

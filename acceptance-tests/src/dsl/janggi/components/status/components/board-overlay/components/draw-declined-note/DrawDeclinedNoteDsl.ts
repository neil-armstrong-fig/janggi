import {DrawDeclinedNotePlaywright} from "@src/dsl/janggi/components/status/components/board-overlay/components/draw-declined-note/playwright/DrawDeclinedNotePlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {Page} from "@playwright/test";

/**
 * The note over the board that a draw was turned down, reached as `janggi.status.overlay.drawDeclinedNote`.
 */
export class DrawDeclinedNoteDsl {
  private readonly drawDeclinedNote: DrawDeclinedNotePlaywright;

  constructor(page: Page) {
    this.drawDeclinedNote = new DrawDeclinedNotePlaywright(page);
  }

  /** The army the game says turned a draw down, or undefined where it reports no refusal. */
  async getDrawDeclinedBy(): Promise<Side | undefined> {
    try {
      return await this.drawDeclinedNote.getDrawDeclinedBy();
    } catch (error) {
      throw new DslError("Failed to read who declined the draw", error);
    }
  }
}

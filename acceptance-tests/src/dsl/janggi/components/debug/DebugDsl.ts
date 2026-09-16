import {DebugPlaywright} from "@src/dsl/janggi/components/debug/playwright/DebugPlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import type {Page} from "@playwright/test";
import type {SaveProgress} from "@src/shared/share-keys/types/SaveProgress";

/**
 * The app's debug door, reached as `janggi.debug` — putting a player anywhere on the ladder in one call,
 * without playing the games or pasting a save key.
 *
 * **It is not a way round the app.** Everything a player does is still done through the screen they do it
 * on; this only arranges what they have *earned*, which is otherwise tens of games deep. The save box
 * that does the same by hand has its own criteria in `progress/MovingYourProgress.test.ts`, so the door
 * never stands in for anything a player can reach.
 */
export class DebugDsl {
  private readonly debug: DebugPlaywright;

  constructor(page: Page) {
    this.debug = new DebugPlaywright(page);
  }

  /** Sets the player's XP, and optionally the bots each army has beaten. */
  async setProgress(progress: SaveProgress): Promise<void> {
    try {
      await this.debug.setProgress(progress);
    } catch (error) {
      throw new DslError(`Failed to set the player's progress to ${JSON.stringify(progress)}`, error);
    }
  }
}

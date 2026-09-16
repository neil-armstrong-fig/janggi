import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import type {SaveProgress} from "@src/shared/share-keys/types/SaveProgress";

/**
 * The door the app opens for a test: a message posted to the page setting the player's progress, which
 * `ListenForDebugMessages` answers.
 *
 * It waits for the XP to arrive on the page rather than returning as soon as the message is posted —
 * `postMessage` is delivered on a later task, so a spec that carried straight on would race it.
 */
export class DebugPlaywright extends BaseComponent {
  private readonly xp: Locator;

  constructor(page: Page) {
    super(page);

    this.xp = page.getByTestId("progress-xp");
  }

  async setProgress(progress: SaveProgress): Promise<void> {
    await this.xp.waitFor({state: "attached"});

    await this.page.evaluate(asked => {
      window.postMessage({janggi: "debug", progress: asked});
    }, progress);

    await this.page.waitForFunction(
      amount => document.querySelector("[data-testid='progress-xp']")?.getAttribute("data-xp") === String(amount),
      progress.xp,
    );
  }
}

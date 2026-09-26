import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * The Progress section of the settings sheet: the XP, its bar, the next unlock, the save key to copy and the box
 * to load one.
 *
 * Reading the XP needs nothing, the sheet always being in the page. Reading the save key does — it is
 * only shown once Copy has been pressed — so `getSaveKey` presses it in the sheet, the way `RecordSheet`
 * opens its tab to read a rating.
 */
export class ProgressSettingPlaywright extends SettingsSheetComponent {
  private readonly xp: Locator;
  private readonly xpBar: Locator;
  private readonly nextUnlock: Locator;
  private readonly copy: Locator;
  private readonly key: Locator;
  private readonly input: Locator;
  private readonly load: Locator;
  private readonly message: Locator;
  private readonly replay: Locator;

  constructor(page: Page) {
    super(page);

    this.xp = page.getByTestId("progress-xp");
    this.xpBar = page.getByTestId("progress-xp-bar");
    this.nextUnlock = page.getByTestId("progress-next-unlock");
    this.copy = page.getByTestId("save-copy");
    this.key = page.getByTestId("save-key");
    this.input = page.getByTestId("save-load-input");
    this.load = page.getByTestId("save-load-submit");
    this.message = page.getByTestId("save-load-message");
    this.replay = page.getByTestId("tour-replay");
  }

  async loadSave(key: string): Promise<void> {
    await this.inSheet(this.input, async () => {
      await this.input.fill(key);
      await this.load.click();
      await this.message.waitFor({state: "attached"});
    });
  }

  /**
   * Presses "Replay the tour" on the Progress tab, and leaves the sheet as the tour puts it: the tour's
   * first step wants the board, so it puts the sheet away itself, and there is nothing left to close.
   */
  async replayTheTour(): Promise<void> {
    await this.openIfClosed();
    await this.tabNamed("Progress").click();
    await this.replay.click();
  }

  async getXp(): Promise<number> {
    return Number(await this.xp.getAttribute("data-xp"));
  }

  /**
   * How full the XP bar is, as a whole percent of the way from the last unlock to the next, or undefined
   * where no bar is drawn — once everything is unlocked. Counted first, so a bar that is not there never
   * reads as one that is empty.
   */
  async getXpBarPercent(): Promise<number | undefined> {
    if ((await this.xpBar.count()) === 0) return undefined;

    return Number(await this.xpBar.getAttribute("data-percent"));
  }

  /** The XP the next unlock needs, or undefined once everything is unlocked. */
  async getNextUnlockXp(): Promise<number | undefined> {
    const xp = await this.nextUnlock.getAttribute("data-xp");

    return xp === null ? undefined : Number(xp);
  }

  async getSaveKey(): Promise<string> {
    let key = "";

    await this.inSheet(this.copy, async () => {
      await this.copy.click();
      key = await this.key.inputValue();
    });

    return key;
  }

  async isSaveRefused(): Promise<boolean> {
    return (await this.message.getAttribute("data-accepted")) === "false";
  }
}

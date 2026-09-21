import type {Locator, Page} from "@playwright/test";
import {ELEPHANT_PAIRINGS} from "@janggi/shared/janggi/settings/ElephantPairing";
import type {ElephantPairing} from "@janggi/shared/janggi/settings/ElephantPairing";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";
import type {SettingsTabName} from "@janggi/shared/janggi/settings/SettingsTabName";

/**
 * The settings sheet — the part of it that belongs to no single picker: the 맞상/엇상 line beneath
 * the two setup pickers, New game beneath that, and the tabs the whole sheet is divided into.
 *
 * It holds no other component. Each picker is built by its own `*Dsl` from the page, so this is the
 * counterpart of `SettingsDsl` and nothing else's parent.
 */
export class SettingsPlaywright extends SettingsSheetComponent {
  private readonly elephantPairing: Locator;
  private readonly newGame: Locator;

  constructor(page: Page) {
    super(page);

    this.elephantPairing = page.getByTestId("elephant-pairing");
    this.newGame = page.getByTestId("new-game");
  }

  /**
   * Whether the line is on screen at all. Distinct from `getElephantPairing` returning nothing: an
   * empty line with no pairing on it would answer the same there, and is a blank row under the
   * pickers rather than the absence the design intends.
   */
  async isElephantPairingShown(): Promise<boolean> {
    return (await this.elephantPairing.count()) > 0;
  }

  /**
   * How the two chosen arrangements sit against each other, or nothing where the pairing is not one
   * the game has a name for.
   */
  async getElephantPairing(): Promise<ElephantPairing | undefined> {
    if ((await this.elephantPairing.count()) === 0) return undefined;

    const pairing = await this.elephantPairing.getAttribute("data-pairing");

    return ELEPHANT_PAIRINGS.find(candidate => candidate === pairing);
  }

  async isGuideLinkedFromGame(): Promise<boolean> {
    const href = await this.page.getByTestId("guide-open").getAttribute("href");

    return href !== null && new URL(href, this.page.url()).href === new URL("learn.html", this.page.url()).href;
  }

  /** Only opens the sheet: dealing a new game closes it, so the player is looking at the new board. */
  async startNewGame(): Promise<void> {
    await this.openSheet(this.newGame);
    await this.newGame.click();
  }

  /** Opens the sheet and leaves it open, so the board can be watched behind it. */
  async openTheSettings(): Promise<void> {
    await this.openIfClosed();
  }

  async isOpen(): Promise<boolean> {
    return await this.isSheetOpen();
  }

  /**
   * Whether a tab's pane is on screen. Read off the pane alone, and deliberately not combined with
   * `isTabSelected`: a pane that failed to put itself away under an unselected tab would then still
   * answer no, the tab's mark hiding the fault.
   */
  async isTabShowing(name: SettingsTabName): Promise<boolean> {
    return await this.page.locator(`[data-testid='settings-pane'][data-pane='${name}']`).isVisible();
  }

  /** Whether a tab is marked as the one chosen, read off its `aria-selected`. */
  async isTabSelected(name: SettingsTabName): Promise<boolean> {
    return (await this.tabNamed(name).getAttribute("aria-selected")) === "true";
  }

  /** Presses the tab, so a tab already showing is left as it is. It stays chosen when the sheet closes. */
  async selectTab(name: SettingsTabName): Promise<void> {
    const tab = this.tabNamed(name);

    await this.withSheetOpen(async () => {
      if ((await tab.getAttribute("aria-selected")) !== "true") await tab.click();
    });
  }

  /**
   * Whether the sheet has any of an intersection under it, judged by where each is drawn — so the
   * answer does not change with how see-through the sheet is, only with how much of the board it
   * reaches up over. A closed sheet is below the screen and covers nothing.
   */
  async isCoveringTheBoardAt(file: number, rank: number): Promise<boolean> {
    const cell = await this.page.getByTestId("board").getByTestId(`cell-f${file}r${rank}`).boundingBox();
    const sheet = await this.sheet.boundingBox();
    if (cell === null || sheet === null) throw new Error("Expected both the intersection and the sheet to be drawn");

    const overlapsAcross = sheet.x < cell.x + cell.width && cell.x < sheet.x + sheet.width;
    const overlapsDown = sheet.y < cell.y + cell.height && cell.y < sheet.y + sheet.height;

    return overlapsAcross && overlapsDown;
  }
}

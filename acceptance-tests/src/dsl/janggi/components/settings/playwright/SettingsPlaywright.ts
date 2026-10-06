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
    const href = (await this.page.getByTestId("guide-open").getAttribute("href")) ?? undefined;

    return href !== undefined && new URL(href, this.page.url()).href === new URL("learn.html", this.page.url()).href;
  }

  async getDeveloperWebsiteDestination(): Promise<string> {
    return await this.appHelpDestination("developer-website-open");
  }

  async getRepositoryDestination(): Promise<string> {
    return await this.appHelpDestination("repository-open");
  }

  private async appHelpDestination(testId: string): Promise<string> {
    const href = (await this.page.getByTestId(testId).getAttribute("href")) ?? undefined;
    if (href === undefined) throw new Error(`The ${testId} link has no destination`);

    return href;
  }

  async doExternalAppHelpLinksOpenSeparately(): Promise<boolean> {
    const developerWebsite = this.page.getByTestId("developer-website-open");
    const repository = this.page.getByTestId("repository-open");

    return (
      (await developerWebsite.getAttribute("target")) === "_blank" &&
      (await developerWebsite.getAttribute("rel")) === "noopener noreferrer" &&
      (await repository.getAttribute("target")) === "_blank" &&
      (await repository.getAttribute("rel")) === "noopener noreferrer"
    );
  }

  /** Only opens the sheet: dealing a new game closes it, so the player is looking at the new board. */
  /** The words on the New game button, as written rather than as the stylesheet draws them. */
  async getNewGameLabel(): Promise<string> {
    return ((await this.newGame.textContent()) ?? "").trim();
  }

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

  /** The words on a tab, as the player reads them. */
  async getTabLabel(name: SettingsTabName): Promise<string> {
    return ((await this.tabNamed(name).textContent()) ?? "").trim();
  }

  /** Whether a tab draws a picture beside its name, so it can be told apart without reading it. */
  async isTabIconShown(name: SettingsTabName): Promise<boolean> {
    return await this.tabNamed(name).getByTestId("settings-tab-icon").isVisible();
  }

  /** The selected layer has exactly the tab button's bounds, so no inset or stale column width remains. */
  async doesSelectedTabHighlightFillTab(name: SettingsTabName): Promise<boolean> {
    const tab = this.tabNamed(name);
    const tabBounds = (await tab.boundingBox()) ?? undefined;
    if (tabBounds === undefined) return false;

    const highlightBounds = (await tab.getByTestId("settings-tab-highlight").boundingBox()) ?? undefined;
    if (highlightBounds === undefined) return false;

    return (
      tabBounds.x === highlightBounds.x &&
      tabBounds.y === highlightBounds.y &&
      tabBounds.width === highlightBounds.width &&
      tabBounds.height === highlightBounds.height
    );
  }

  /** Every label is visible in one row, within the viewport, with a fingertip-sized target. */
  async canTabsFitInOneRow(): Promise<boolean> {
    return await this.sheet.getByTestId("settings-tab").evaluateAll(tabs => {
      const bounds = tabs.map(tab => tab.getBoundingClientRect());
      const first = bounds[0];

      return (
        tabs.length === 4 &&
        first !== undefined &&
        tabs.every((tab, index) => {
          const box = bounds[index];

          return (
            box !== undefined &&
            Math.abs(box.top - first.top) < 1 &&
            box.left >= 0 &&
            box.right <= window.innerWidth &&
            box.width >= 44 &&
            box.height >= 44 &&
            tab.scrollWidth <= tab.clientWidth
          );
        }) &&
        document.documentElement.scrollWidth <= window.innerWidth
      );
    });
  }

  /** Presses the tab, so a tab already showing is left as it is. It stays chosen when the sheet closes. */
  /** Scrolls a tab's settings to their end, with the sheet shut again afterwards, as a player who read down it and left would. */
  async scrollTabToTheEnd(name: SettingsTabName): Promise<void> {
    await this.withSheetOpen(async () => {
      await this.tabNamed(name).click();
      await this.scrollOf(name).evaluate(column => {
        column.scrollTop = column.scrollHeight;
      });
    });
  }

  /** How far a tab's settings are scrolled, in pixels. */
  async getTabScroll(name: SettingsTabName): Promise<number> {
    return await this.scrollOf(name).evaluate(column => column.scrollTop);
  }

  private scrollOf(name: SettingsTabName): Locator {
    return this.page.locator(`[data-testid='settings-pane'][data-pane='${name}']`).getByTestId("settings-scroll");
  }

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
    const cell = (await this.page.getByTestId("board").getByTestId(`cell-f${file}r${rank}`).boundingBox()) ?? undefined;
    if (cell === undefined) throw new Error("Expected the intersection to be drawn");

    const sheet = (await this.sheet.boundingBox()) ?? undefined;
    if (sheet === undefined) throw new Error("Expected the sheet to be drawn");

    const overlapsAcross = sheet.x < cell.x + cell.width && cell.x < sheet.x + sheet.width;
    const overlapsDown = sheet.y < cell.y + cell.height && cell.y < sheet.y + sheet.height;

    return overlapsAcross && overlapsDown;
  }
}

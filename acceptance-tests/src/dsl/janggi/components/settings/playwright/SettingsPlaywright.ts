import {cellAt} from "@src/dsl/playwright/board/CellAt";
import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";
import type {SettingsTabName} from "@janggi/shared/janggi/settings/SettingsTabName";

/**
 * The settings sheet itself — opening it, and the tabs it is divided into. What is in a tab is each tab's own
 * (`tabs/<tab>-pane/`).
 *
 * It owns its sheet queries; the shared access helper handles opening and restoring navigation.
 */
export class SettingsPlaywright extends SettingsSheetComponent {
  private readonly panes: Record<SettingsTabName, Locator>;
  private readonly settingsTab: Locator;
  private readonly board: Locator;

  constructor(page: Page) {
    super(page);
    this.panes = {
      Play: page.locator("[data-testid='settings-pane'][data-pane='Play']"),
      Look: page.locator("[data-testid='settings-pane'][data-pane='Look']"),
      Sound: page.locator("[data-testid='settings-pane'][data-pane='Sound']"),
      You: page.locator("[data-testid='settings-pane'][data-pane='You']"),
    };

    this.settingsTab = this.sheet.getByTestId("settings-tab");
    this.board = this.page.getByTestId("board");
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
    return await this.panes[name].isVisible();
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
    return await this.settingsTabIconAt(name).isVisible();
  }

  private settingsTabIconAt(name: SettingsTabName): Locator {
    return this.tabNamed(name).getByTestId("settings-tab-icon");
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
    return await this.settingsTab.evaluateAll(tabs => {
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
    return this.panes[name].getByTestId("settings-scroll");
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
    const cell = (await cellAt(this.board, file, rank).boundingBox()) ?? undefined;
    if (cell === undefined) throw new Error("Expected the intersection to be drawn");

    const sheet = (await this.sheet.boundingBox()) ?? undefined;
    if (sheet === undefined) throw new Error("Expected the sheet to be drawn");

    const overlapsAcross = sheet.x < cell.x + cell.width && cell.x < sheet.x + sheet.width;
    const overlapsDown = sheet.y < cell.y + cell.height && cell.y < sheet.y + sheet.height;

    return overlapsAcross && overlapsDown;
  }
}

import type {GroupAppearance} from "@src/dsl/janggi/components/settings/types/GroupAppearance";
import type {Locator, Page} from "@playwright/test";
import {ELEPHANT_PAIRINGS} from "@janggi/shared/janggi/settings/ElephantPairing";
import type {ElephantPairing} from "@janggi/shared/janggi/settings/ElephantPairing";
import type {PlayGroupName} from "@janggi/shared/janggi/settings/PlayGroupName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * The Play tab — the part of it that belongs to no single picker: the groups it is folded into, the 맞상/엇상 line
 * beneath the two setup pickers, and New game beneath that.
 *
 * It holds no other component. Each picker is built by its own `*Dsl` from the page, so this is the counterpart of
 * `PlayPaneDsl` and nothing else's parent.
 */
export class PlayPanePlaywright extends SettingsSheetComponent {
  private readonly groups: Record<PlayGroupName, Locator>;
  private readonly elephantPairing: Locator;
  private readonly newGame: Locator;

  constructor(page: Page) {
    super(page);

    this.groups = {
      Opponent: page.locator("[data-testid='settings-group'][data-group='Opponent']"),
      Format: page.locator("[data-testid='settings-group'][data-group='Format']"),
      Setup: page.locator("[data-testid='settings-group'][data-group='Setup']"),
    };
    this.elephantPairing = page.getByTestId("elephant-pairing");
    this.newGame = page.getByTestId("new-game");
  }

  async isGuidedGameOffered(): Promise<boolean> {
    return (await this.page.getByTestId("play-guided-game").count()) === 1;
  }

  async startTheGuidedGame(): Promise<void> {
    const button = this.page.getByTestId("play-guided-game");
    await this.openSheet(button);
    await button.click();
  }

  async getGuidedGameLabel(): Promise<string> {
    const button = this.page.getByTestId("play-guided-game");

    let label = "";
    await this.inSheet(button, async () => {
      label = await button.innerText();
    });

    return label;
  }

  async isClockInOpponent(): Promise<boolean> {
    return (await this.groups.Opponent.getByTestId("clock-setting").count()) === 1;
  }

  async isClockVisible(): Promise<boolean> {
    return await this.page.getByTestId("clock-setting").isVisible();
  }

  async getGroupAppearance(name: PlayGroupName): Promise<GroupAppearance> {
    return await this.readGroupAppearance(name);
  }

  /** Whether a group is unfolded, read off `data-open` so it answers with the sheet shut. */
  async isGroupOpen(name: PlayGroupName): Promise<boolean> {
    return (await this.groups[name].getAttribute("data-open")) === "true";
  }

  /** Read off `hidden`, since the sheet is out of sight whether or not the group is laid out. */
  async isGroupOffered(name: PlayGroupName): Promise<boolean> {
    return (await this.groups[name].getAttribute("hidden")) === null;
  }

  /** The line a group is folded to, as it reads: a part drawn on a line of its own, as each setup is, starts a new line. */
  async getGroupSummary(name: PlayGroupName): Promise<string> {
    return (await this.groups[name].getByTestId("settings-group-summary").innerText()).trim();
  }

  /** Unfolds a group, pressing its line only where it is folded, since a second press would fold it again. */
  async closeGroup(name: PlayGroupName): Promise<void> {
    const toggle = this.groups[name].getByTestId("settings-group-toggle");
    await this.inSheet(toggle, async () => {
      if (await this.isGroupOpen(name)) await toggle.click();
    });
  }

  async openGroup(name: PlayGroupName): Promise<void> {
    const toggle = this.groups[name].getByTestId("settings-group-toggle");

    await this.inSheet(toggle, async () => {
      if (!(await this.isGroupOpen(name))) await toggle.click();
    });
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

  /** The words on the New game button, as written rather than as the stylesheet draws them. */
  async getNewGameLabel(): Promise<string> {
    return ((await this.newGame.textContent()) ?? "").trim();
  }

  /** Whether New game is on the tab and may be pressed. Read without opening the sheet, which is always in the page. */
  async canStartNewGame(): Promise<boolean> {
    if ((await this.newGame.count()) === 0) return false;

    return await this.newGame.isEnabled();
  }

  /** Only opens the sheet: dealing a new game closes it, so the player is looking at the new board. */
  async startNewGame(): Promise<void> {
    await this.openSheet(this.newGame);
    await this.newGame.click();
  }
}

import type {Locator, Page} from "@playwright/test";
import {ELEPHANT_PAIRINGS} from "@janggi/shared/janggi/settings/ElephantPairing";
import type {ElephantPairing} from "@janggi/shared/janggi/settings/ElephantPairing";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * The settings sheet — the part of it that belongs to no single picker: the 맞상/엇상 line beneath
 * the two setup pickers, and New game beneath that.
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

  /** Only opens the sheet: dealing a new game closes it, so the player is looking at the new board. */
  async startNewGame(): Promise<void> {
    await this.openSheet();
    await this.newGame.click();
  }
}

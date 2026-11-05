import type {Locator, Page} from "@playwright/test";
import {GAMES_SHOWN} from "@janggi/shared/janggi/online/GameShown";
import type {GameShown} from "@janggi/shared/janggi/online/GameShown";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/** The choice between the game on the board and the one waiting, shown in the Play tab while a game with a friend is on. */
export class GamesSettingPlaywright extends SettingsSheetComponent {
  private readonly picker: Locator;
  private readonly options: Record<GameShown, Locator>;

  constructor(page: Page) {
    super(page);

    this.picker = page.getByTestId("games-picker");
    this.options = {
      local: page.getByTestId("games-option-local"),
      friend: page.getByTestId("games-option-friend"),
    };
  }

  async switchTo(game: GameShown): Promise<void> {
    await this.inSheet(this.picker, () => this.options[game].click());
  }

  /** Taps Online with the settings open on the Play tab, and leaves them to whatever the tap led to. */
  async chooseOnline(): Promise<void> {
    await this.openSheet(this.options.friend);
    await this.options.friend.click();
  }

  /** The game on the board. */
  async getShown(): Promise<GameShown> {
    const pressed = this.picker.locator("[aria-pressed='true']");
    const shown = await pressed.getAttribute("data-game");

    return GAMES_SHOWN.find(known => known === shown) ?? "local";
  }

  /** Whether the game with the friend is waiting on this player's move, which its button says. */
  async isYourMoveWaiting(): Promise<boolean> {
    return (await this.options.friend.getAttribute("data-your-move")) === "true";
  }
}

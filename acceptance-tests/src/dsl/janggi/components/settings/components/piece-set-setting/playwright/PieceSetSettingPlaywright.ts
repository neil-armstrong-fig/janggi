import type {Locator, Page} from "@playwright/test";
import {PIECE_SET_NAMES} from "@janggi/shared/janggi/settings/PieceSetName";
import type {PieceSetName} from "@janggi/shared/janggi/settings/PieceSetName";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/** The piece-set picker. Test ids spelled out — see the note in `BoardSettingPlaywright`. */
export class PieceSetSettingPlaywright extends BaseComponent {
  private readonly picker: Locator;
  private readonly options: Record<PieceSetName, Locator>;

  constructor(page: Page) {
    super(page);

    this.picker = page.getByTestId("piece-style-picker");
    this.options = {
      Traditional: page.getByTestId("piece-style-option-traditional"),
      Hanja: page.getByTestId("piece-style-option-hanja"),
      Hangul: page.getByTestId("piece-style-option-hangul"),
      Modern: page.getByTestId("piece-style-option-modern"),
    };
  }

  async choose(name: PieceSetName): Promise<void> {
    await this.options[name].click();
  }

  async selected(): Promise<PieceSetName | undefined> {
    const pressed = this.picker.locator("[aria-pressed='true']");
    if ((await pressed.count()) === 0) return undefined;

    const name = await pressed.textContent();

    return PIECE_SET_NAMES.find(candidate => candidate === name);
  }
}

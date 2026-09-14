import type {Locator, Page} from "@playwright/test";
import {PIECE_SET_NAMES} from "@janggi/shared/janggi/settings/PieceSetName";
import type {PieceSetName} from "@janggi/shared/janggi/settings/PieceSetName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * The piece-set picker. Test ids spelled out — see the note in `BoardSettingPlaywright` — and a
 * dropdown driven as `HanSetupSettingPlaywright` describes.
 */
export class PieceSetSettingPlaywright extends SettingsSheetComponent {
  private readonly select: Locator;
  private readonly options: Record<PieceSetName, Locator>;

  constructor(page: Page) {
    super(page);

    this.select = page.getByTestId("piece-style-select");
    this.options = {
      Traditional: page.getByTestId("piece-style-option-traditional"),
      Hanja: page.getByTestId("piece-style-option-hanja"),
      Hangul: page.getByTestId("piece-style-option-hangul"),
      Modern: page.getByTestId("piece-style-option-modern"),
    };
  }

  async choose(name: PieceSetName): Promise<void> {
    const value = await this.options[name].getAttribute("value");
    if (value === null) throw new Error(`The "${name}" option carries no value to select`);

    await this.inSheet(async () => {
      await this.select.selectOption(value);
    });
  }

  async getSelected(): Promise<PieceSetName | undefined> {
    const name = await this.select.locator("option:checked").textContent();

    return PIECE_SET_NAMES.find(candidate => candidate === name);
  }
}

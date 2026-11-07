import {StylePicker} from "@src/dsl/janggi/components/settings/tabs/look-pane/playwright/components/style-picker/StylePicker";
import type {Locator, Page} from "@playwright/test";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {PIECE_SET_NAMES} from "@janggi/shared/janggi/settings/PieceSetName";
import type {PieceSetName} from "@janggi/shared/janggi/settings/PieceSetName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * The piece-set picker. Test ids spelled out — see the note in `BoardSettingPlaywright` — and a
 * dropdown driven as `HanSetupSettingPlaywright` describes, read by `value` so a locked option's padlock
 * never reaches a spec.
 */
export class PieceSetSettingPlaywright extends SettingsSheetComponent {
  private readonly select: Locator;
  private readonly split: Locator;
  private readonly armySelects: Record<Side, Locator>;
  private readonly options: Record<PieceSetName, Locator>;
  private readonly stylePicker: StylePicker<PieceSetName>;

  constructor(page: Page) {
    super(page);

    this.select = page.getByTestId("piece-style-select");
    this.split = page.getByTestId("piece-style-split");
    this.armySelects = {
      han: page.getByTestId("han-piece-style-select"),
      cho: page.getByTestId("cho-piece-style-select"),
    };
    this.options = {
      Traditional: page.getByTestId("piece-style-option-traditional"),
      Hangul: page.getByTestId("piece-style-option-hangul"),
      Modern: page.getByTestId("piece-style-option-modern"),
      Hanja: page.getByTestId("piece-style-option-hanja"),
      Diagram: page.getByTestId("piece-style-option-diagram"),
      Tournament: page.getByTestId("piece-style-option-tournament"),
      Celadon: page.getByTestId("piece-style-option-celadon"),
      Dancheong: page.getByTestId("piece-style-option-dancheong"),
      Hacker: page.getByTestId("piece-style-option-hacker"),
    };

    this.stylePicker = new StylePicker(
      {select: this.select, split: this.split, armySelects: this.armySelects, options: this.options},
      PIECE_SET_NAMES,
    );
  }

  async choose(name: PieceSetName): Promise<void> {
    const value = await this.stylePicker.getOptionValue(name);
    await this.chooseNamed(value);
  }

  async chooseNamed(name: string): Promise<void> {
    await this.inSheet(this.select, () => this.stylePicker.chooseNamed(name));
  }

  /** Whether Han's and Cho's pieces are chosen apart. */
  async isChosenApart(): Promise<boolean> {
    return await this.stylePicker.isChosenApart();
  }

  /** Turns choosing the armies' pieces apart on, or off — which puts both back in Cho's. */
  async toggleChoosingApart(): Promise<void> {
    await this.inSheet(this.split, () => this.stylePicker.toggleChoosingApart());
  }

  async chooseForArmy(side: Side, name: string): Promise<void> {
    await this.inSheet(this.armySelects[side], () => this.stylePicker.chooseForArmy(side, name));
  }

  async getSelectedNameForArmy(side: Side): Promise<string> {
    return await this.stylePicker.getSelectedNameForArmy(side);
  }

  async getSelected(): Promise<PieceSetName | undefined> {
    return await this.stylePicker.getSelected();
  }

  async getSelectedName(): Promise<string> {
    return await this.stylePicker.getSelectedName();
  }

  async getBuiltInOrder(): Promise<PieceSetName[]> {
    return await this.stylePicker.getBuiltInOrder();
  }

  async isLocked(name: PieceSetName): Promise<boolean> {
    return await this.stylePicker.isLocked(name);
  }
}

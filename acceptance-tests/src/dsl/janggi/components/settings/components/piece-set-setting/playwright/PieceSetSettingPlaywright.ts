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
  }

  async choose(name: PieceSetName): Promise<void> {
    const value = await this.options[name].getAttribute("value");
    if (value === null) throw new Error(`The "${name}" option carries no value to select`);

    await this.chooseNamed(value);
  }

  async chooseNamed(name: string): Promise<void> {
    await this.inSheet(this.select, async () => {
      await this.select.selectOption(name);
    });
  }

  /** Whether Han's and Cho's pieces are chosen apart. */
  async isChosenApart(): Promise<boolean> {
    return (await this.split.getAttribute("aria-pressed")) === "true";
  }

  /** Turns choosing the armies' pieces apart on, or off — which puts both back in Cho's. */
  async toggleChoosingApart(): Promise<void> {
    await this.inSheet(this.split, async () => {
      await this.split.click();
    });
  }

  async chooseForArmy(side: Side, name: string): Promise<void> {
    await this.inSheet(this.armySelects[side], async () => {
      await this.armySelects[side].selectOption(name);
    });
  }

  async getSelectedNameForArmy(side: Side): Promise<string> {
    return await this.armySelects[side].inputValue();
  }

  async getSelected(): Promise<PieceSetName | undefined> {
    const name = await this.select.inputValue();

    return PIECE_SET_NAMES.find(candidate => candidate === name);
  }

  async getSelectedName(): Promise<string> {
    return await this.select.inputValue();
  }

  async getBuiltInOrder(): Promise<PieceSetName[]> {
    const names = await this.select
      .locator("option")
      .evaluateAll(options => options.map(option => option.getAttribute("value")));

    return names.flatMap(name => {
      const builtIn = PIECE_SET_NAMES.find(candidate => candidate === name);

      return builtIn ? [builtIn] : [];
    });
  }

  async isLocked(name: PieceSetName): Promise<boolean> {
    return (await this.options[name].getAttribute("data-locked")) !== null;
  }
}

import {StylePicker} from "@src/dsl/janggi/components/settings/tabs/look-pane/playwright/components/style-picker/StylePicker";
import {BOARD_STYLE_NAMES} from "@janggi/shared/janggi/settings/BoardStyleName";
import type {BoardStyleName} from "@janggi/shared/janggi/settings/BoardStyleName";
import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * The board picker: one locator per option, written out.
 *
 * The test ids are spelled out rather than derived from the option's name. The webapp builds them
 * from that name, and a test that recomputed them the same way would agree with the webapp no
 * matter what either of them did — these are the contract, so they are stated.
 *
 * Typing the map as `Record<BoardStyleName, Locator>` means a style added to `@janggi/shared` and
 * not given a locator here is a compile error rather than a spec nobody wrote.
 *
 * More than two boards ship, so it is a native select, chosen and read by `value` — which stays the
 * bare name even where a locked option's text carries a padlock after it. A player's own style has no
 * locator of its own, being named however they like, so it is chosen by that name directly.
 */
export class BoardSettingPlaywright extends SettingsSheetComponent {
  private readonly select: Locator;
  private readonly split: Locator;
  private readonly armySelects: Record<Side, Locator>;
  private readonly options: Record<BoardStyleName, Locator>;
  private readonly stylePicker: StylePicker<BoardStyleName>;

  constructor(page: Page) {
    super(page);

    this.select = page.getByTestId("board-style-select");
    this.split = page.getByTestId("board-style-split");
    this.armySelects = {
      han: page.getByTestId("han-board-style-select"),
      cho: page.getByTestId("cho-board-style-select"),
    };
    this.options = {
      Classic: page.getByTestId("board-style-option-classic"),
      Neon: page.getByTestId("board-style-option-neon"),
      Diagram: page.getByTestId("board-style-option-diagram"),
      Tournament: page.getByTestId("board-style-option-tournament"),
      Celadon: page.getByTestId("board-style-option-celadon"),
      Dancheong: page.getByTestId("board-style-option-dancheong"),
      Hacker: page.getByTestId("board-style-option-hacker"),
    };

    this.stylePicker = new StylePicker(
      {select: this.select, split: this.split, armySelects: this.armySelects, options: this.options},
      BOARD_STYLE_NAMES,
    );
  }

  async choose(name: BoardStyleName): Promise<void> {
    const value = await this.stylePicker.getOptionValue(name);
    await this.chooseNamed(value);
  }

  async chooseNamed(name: string): Promise<void> {
    await this.inSheet(this.select, () => this.stylePicker.chooseNamed(name));
  }

  /** Whether Han's and Cho's boards are chosen apart. */
  async isChosenApart(): Promise<boolean> {
    return await this.stylePicker.isChosenApart();
  }

  /** Turns choosing the armies' boards apart on, or off — which puts both back in Cho's. */
  async toggleChoosingApart(): Promise<void> {
    await this.inSheet(this.split, () => this.stylePicker.toggleChoosingApart());
  }

  async chooseForArmy(side: Side, name: string): Promise<void> {
    await this.inSheet(this.armySelects[side], () => this.stylePicker.chooseForArmy(side, name));
  }

  async getSelectedNameForArmy(side: Side): Promise<string> {
    return await this.stylePicker.getSelectedNameForArmy(side);
  }

  async getSelected(): Promise<BoardStyleName | undefined> {
    return await this.stylePicker.getSelected();
  }

  async getSelectedName(): Promise<string> {
    return await this.stylePicker.getSelectedName();
  }

  async isLocked(name: BoardStyleName): Promise<boolean> {
    return await this.stylePicker.isLocked(name);
  }
}

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
  }

  async choose(name: BoardStyleName): Promise<void> {
    const value = await this.options[name].getAttribute("value");
    if (value === null) throw new Error(`The "${name}" option carries no value to select`);

    await this.chooseNamed(value);
  }

  async chooseNamed(name: string): Promise<void> {
    await this.inSheet(this.select, async () => {
      await this.select.selectOption(name);
    });
  }

  /** Whether Han's and Cho's boards are chosen apart. */
  async isChosenApart(): Promise<boolean> {
    return (await this.split.getAttribute("aria-pressed")) === "true";
  }

  /** Turns choosing the armies' boards apart on, or off — which puts both back in Cho's. */
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

  async getSelected(): Promise<BoardStyleName | undefined> {
    const name = await this.select.inputValue();

    return BOARD_STYLE_NAMES.find(candidate => candidate === name);
  }

  async getSelectedName(): Promise<string> {
    return await this.select.inputValue();
  }

  async isLocked(name: BoardStyleName): Promise<boolean> {
    return (await this.options[name].getAttribute("data-locked")) !== null;
  }
}

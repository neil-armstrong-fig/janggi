import {BOARD_STYLE_NAMES} from "@janggi/shared/janggi/settings/BoardStyleName";
import type {BoardStyleName} from "@janggi/shared/janggi/settings/BoardStyleName";
import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * The board picker: one locator per option, written out.
 *
 * The test ids are spelled out rather than derived from the option's name. The webapp builds them
 * from that name, and a test that recomputed them the same way would agree with the webapp no
 * matter what either of them did — these are the contract, so they are stated.
 *
 * Typing the map as `Record<BoardStyleName, Locator>` means a style added to `@janggi/shared` and
 * not given a locator here is a compile error rather than a spec nobody wrote.
 */
export class BoardSettingPlaywright extends SettingsSheetComponent {
  private readonly picker: Locator;
  private readonly options: Record<BoardStyleName, Locator>;

  constructor(page: Page) {
    super(page);

    this.picker = page.getByTestId("board-style-picker");
    this.options = {
      Classic: page.getByTestId("board-style-option-classic"),
      Neon: page.getByTestId("board-style-option-neon"),
    };
  }

  async choose(name: BoardStyleName): Promise<void> {
    await this.inSheet(this.picker, () => this.options[name].click());
  }

  /** The name on whichever button is pressed, or undefined before anything has rendered. */
  async getSelected(): Promise<BoardStyleName | undefined> {
    const pressed = this.picker.locator("[aria-pressed='true']");
    if ((await pressed.count()) === 0) return undefined;

    const name = await pressed.textContent();

    return BOARD_STYLE_NAMES.find(candidate => candidate === name);
  }
}

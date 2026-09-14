import {MOVABLE_HIGHLIGHT_NAMES} from "@janggi/shared/janggi/settings/MovableHighlightName";
import type {Locator, Page} from "@playwright/test";
import type {MovableHighlightName} from "@janggi/shared/janggi/settings/MovableHighlightName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * The picker for whether the movable pieces are marked: one locator per option, written out.
 *
 * The same shape as every other picker here, and for the same reason — the test ids are the
 * contract, so they are stated rather than recomputed from the option's name the way the webapp
 * builds them.
 */
export class MovableHighlightSettingPlaywright extends SettingsSheetComponent {
  private readonly picker: Locator;
  private readonly options: Record<MovableHighlightName, Locator>;

  constructor(page: Page) {
    super(page);

    this.picker = page.getByTestId("movable-highlight-picker");
    this.options = {
      Shown: page.getByTestId("movable-highlight-option-shown"),
      Hidden: page.getByTestId("movable-highlight-option-hidden"),
    };
  }

  async choose(name: MovableHighlightName): Promise<void> {
    await this.inSheet(() => this.options[name].click());
  }

  /** The name on whichever button is pressed, or undefined before anything has rendered. */
  async getSelected(): Promise<MovableHighlightName | undefined> {
    const pressed = this.picker.locator("[aria-pressed='true']");
    if ((await pressed.count()) === 0) return undefined;

    const name = await pressed.textContent();

    return MOVABLE_HIGHLIGHT_NAMES.find(candidate => candidate === name);
  }
}

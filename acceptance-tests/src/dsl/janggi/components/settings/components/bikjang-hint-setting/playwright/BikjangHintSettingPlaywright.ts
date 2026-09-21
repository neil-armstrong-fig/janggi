import {BIKJANG_HINT_NAMES} from "@janggi/shared/janggi/settings/BikjangHintName";
import type {BikjangHintName} from "@janggi/shared/janggi/settings/BikjangHintName";
import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * The picker for whether a move that could allow a bikjang is labelled: one locator per option, written
 * out.
 *
 * The same shape as every other picker here, and for the same reason — the test ids are the
 * contract, so they are stated rather than recomputed from the option's name the way the webapp
 * builds them.
 */
export class BikjangHintSettingPlaywright extends SettingsSheetComponent {
  private readonly picker: Locator;
  private readonly options: Record<BikjangHintName, Locator>;

  constructor(page: Page) {
    super(page);

    this.picker = page.getByTestId("bikjang-hint-picker");
    this.options = {
      Shown: page.getByTestId("bikjang-hint-option-shown"),
      Hidden: page.getByTestId("bikjang-hint-option-hidden"),
    };
  }

  async choose(name: BikjangHintName): Promise<void> {
    await this.inSheet(this.picker, () => this.options[name].click());
  }

  /** The name on whichever button is pressed, or undefined before anything has rendered. */
  async getSelected(): Promise<BikjangHintName | undefined> {
    const pressed = this.picker.locator("[aria-pressed='true']");
    if ((await pressed.count()) === 0) return undefined;

    const name = await pressed.textContent();

    return BIKJANG_HINT_NAMES.find(candidate => candidate === name);
  }
}

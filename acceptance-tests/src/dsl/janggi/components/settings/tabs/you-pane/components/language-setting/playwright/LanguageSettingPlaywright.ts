import type {Locator, Page} from "@playwright/test";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import {LANGUAGE_NAMES} from "@janggi/shared/janggi/settings/LanguageName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/** The picker for which language the game is read in. */
export class LanguageSettingPlaywright extends SettingsSheetComponent {
  private readonly picker: Locator;
  private readonly options: Record<LanguageName, Locator>;

  constructor(page: Page) {
    super(page);

    this.picker = page.getByTestId("language-picker");
    this.options = {
      en: page.getByTestId("language-option-en"),
      ko: page.getByTestId("language-option-ko"),
    };
  }

  async choose(name: LanguageName): Promise<void> {
    await this.inSheet(this.picker, () => this.options[name].click());
  }

  /** The language on whichever button is pressed, or undefined before anything has rendered. */
  async getSelected(): Promise<LanguageName | undefined> {
    const pressed = this.picker.locator("[aria-pressed='true']");
    if ((await pressed.count()) === 0) return undefined;

    const name = await pressed.getAttribute("data-option");

    return LANGUAGE_NAMES.find(candidate => candidate === name);
  }
}

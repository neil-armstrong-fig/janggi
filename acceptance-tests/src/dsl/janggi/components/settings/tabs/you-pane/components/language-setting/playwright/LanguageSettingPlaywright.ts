import {OptionPicker} from "@src/dsl/janggi/components/settings/playwright/components/option-picker/OptionPicker";
import type {Locator, Page} from "@playwright/test";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import {LANGUAGE_NAMES} from "@janggi/shared/janggi/settings/LanguageName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/** The picker for which language the game is read in. */
export class LanguageSettingPlaywright extends SettingsSheetComponent {
  private readonly picker: Locator;
  private readonly options: Record<LanguageName, Locator>;
  private readonly optionPicker: OptionPicker<LanguageName>;

  constructor(page: Page) {
    super(page);

    this.picker = page.getByTestId("language-picker");
    this.options = {
      en: page.getByTestId("language-option-en"),
      ko: page.getByTestId("language-option-ko"),
    };

    this.optionPicker = new OptionPicker(this.picker, LANGUAGE_NAMES);
  }

  async choose(name: LanguageName): Promise<void> {
    await this.inSheet(this.picker, () => this.options[name].click());
  }

  /** The language on whichever button is pressed, or undefined before anything has rendered. */
  async getSelected(): Promise<LanguageName | undefined> {
    return await this.optionPicker.getSelected();
  }
}

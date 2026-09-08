import type {Locator, Page} from "@playwright/test";
import {SETUP_NAMES} from "@janggi/shared/janggi/settings/SetupName";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/**
 * Cho's opening-setup picker. The two armies choose separately, so each has its own picker and
 * its own component — test ids spelled out, as in `BoardSettingPlaywright`.
 */
export class ChoSetupSettingPlaywright extends BaseComponent {
  private readonly picker: Locator;
  private readonly options: Record<SetupName, Locator>;

  constructor(page: Page) {
    super(page);

    this.picker = page.getByTestId("cho-setup-picker");
    this.options = {
      "Inner Elephant": page.getByTestId("cho-setup-option-inner-elephant"),
      "Outer Elephant": page.getByTestId("cho-setup-option-outer-elephant"),
      "Left Elephant": page.getByTestId("cho-setup-option-left-elephant"),
      "Right Elephant": page.getByTestId("cho-setup-option-right-elephant"),
      "Central Chariot": page.getByTestId("cho-setup-option-central-chariot"),
    };
  }

  async choose(name: SetupName): Promise<void> {
    await this.options[name].click();
  }

  async selected(): Promise<SetupName | undefined> {
    const pressed = this.picker.locator("[aria-pressed='true']");
    if ((await pressed.count()) === 0) return undefined;

    const name = await pressed.textContent();

    return SETUP_NAMES.find(candidate => candidate === name);
  }
}

import type {Locator, Page} from "@playwright/test";
import {SETUP_NAMES} from "@janggi/shared/janggi/settings/SetupName";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * Cho's opening-setup picker. The two armies choose separately, so each has its own picker and
 * its own component — a dropdown driven as `HanSetupSettingPlaywright` describes.
 */
export class ChoSetupSettingPlaywright extends SettingsSheetComponent {
  private readonly select: Locator;
  private readonly options: Record<SetupName, Locator>;

  constructor(page: Page) {
    super(page);

    this.select = page.getByTestId("cho-setup-select");
    this.options = {
      "Inner Elephant": page.getByTestId("cho-setup-option-inner-elephant"),
      "Outer Elephant": page.getByTestId("cho-setup-option-outer-elephant"),
      "Left Elephant": page.getByTestId("cho-setup-option-left-elephant"),
      "Right Elephant": page.getByTestId("cho-setup-option-right-elephant"),
      "Central Chariot": page.getByTestId("cho-setup-option-central-chariot"),
    };
  }

  /** Whether the picker is still live — the pickers lock once a move has been played. */
  async isChoosable(): Promise<boolean> {
    return await this.select.isEnabled();
  }

  async choose(name: SetupName): Promise<void> {
    const value = await this.options[name].getAttribute("value");
    if (value === null) throw new Error(`The "${name}" option carries no value to select`);

    await this.inSheet(this.select, async () => {
      await this.select.selectOption(value);
    });
  }

  /** The name of the chosen option, or undefined while the dropdown still shows no choice. */
  async getSelected(): Promise<SetupName | undefined> {
    const name = await this.select.locator("option:checked").textContent();

    return SETUP_NAMES.find(candidate => candidate === name);
  }
}

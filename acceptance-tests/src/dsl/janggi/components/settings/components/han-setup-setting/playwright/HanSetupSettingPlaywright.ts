import type {Locator, Page} from "@playwright/test";
import {SETUP_NAMES} from "@janggi/shared/janggi/settings/SetupName";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * Han's opening-setup picker. The two armies choose separately, so each has its own picker and
 * its own component — test ids spelled out, as in `BoardSettingPlaywright`.
 *
 * A dropdown rather than a row of buttons, because five setups do not fit across a phone. An option
 * is chosen by the value its own spelled-out locator carries, so a setup missing from the list fails
 * here rather than being selected by a label that happens to match.
 */
export class HanSetupSettingPlaywright extends SettingsSheetComponent {
  private readonly select: Locator;
  private readonly options: Record<SetupName, Locator>;

  constructor(page: Page) {
    super(page);

    this.select = page.getByTestId("han-setup-select");
    this.options = {
      "Inner Elephant": page.getByTestId("han-setup-option-inner-elephant"),
      "Outer Elephant": page.getByTestId("han-setup-option-outer-elephant"),
      "Left Elephant": page.getByTestId("han-setup-option-left-elephant"),
      "Right Elephant": page.getByTestId("han-setup-option-right-elephant"),
      "Central Chariot": page.getByTestId("han-setup-option-central-chariot"),
    };
  }

  /** Whether the picker is still live — the pickers lock once a move has been played. */
  async isChoosable(): Promise<boolean> {
    return await this.select.isEnabled();
  }

  async choose(name: SetupName): Promise<void> {
    const value = await this.options[name].getAttribute("value");
    if (value === null) throw new Error(`The "${name}" option carries no value to select`);

    await this.inSheet(async () => {
      await this.select.selectOption(value);
    });
  }

  /** The name of the chosen option, or undefined while the dropdown still shows no choice. */
  async getSelected(): Promise<SetupName | undefined> {
    const name = await this.select.locator("option:checked").textContent();

    return SETUP_NAMES.find(candidate => candidate === name);
  }
}

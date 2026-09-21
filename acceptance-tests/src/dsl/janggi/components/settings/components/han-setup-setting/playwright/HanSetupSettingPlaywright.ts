import type {Locator, Page} from "@playwright/test";
import {SETUP_NAMES} from "@janggi/shared/janggi/settings/SetupName";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * Han's opening-setup picker. The two armies choose separately, so each has its own picker and
 * its own component — test ids spelled out, as in `BoardSettingPlaywright`.
 *
 * A wrapped grid of buttons, so the board can be watched laying itself out behind the sheet as each
 * is pressed. The two armies share one place in the sheet, and a switch beside it says which army's
 * grid is showing — so choosing Han's setup first shows Han's grid, whichever was showing before.
 */
export class HanSetupSettingPlaywright extends SettingsSheetComponent {
  private readonly army: Locator;
  private readonly options: Record<SetupName, Locator>;

  constructor(page: Page) {
    super(page);

    this.army = page.getByTestId("setup-army-han");
    this.options = {
      "Inner Elephant": page.getByTestId("han-setup-option-inner-elephant"),
      "Outer Elephant": page.getByTestId("han-setup-option-outer-elephant"),
      "Left Elephant": page.getByTestId("han-setup-option-left-elephant"),
      "Right Elephant": page.getByTestId("han-setup-option-right-elephant"),
      "Central Chariot": page.getByTestId("han-setup-option-central-chariot"),
    };
  }

  async show(): Promise<void> {
    await this.inSheet(this.army, async () => {
      if ((await this.army.getAttribute("aria-pressed")) !== "true") await this.army.click();
    });
  }

  /** Whether this army's grid is on screen — the other's is hidden, not removed. */
  async isShown(): Promise<boolean> {
    return await this.options["Inner Elephant"].isVisible();
  }

  /** Whether the picker is still live — the pickers lock once a move has been played, all options at once. */
  async isChoosable(): Promise<boolean> {
    return await this.options["Inner Elephant"].isEnabled();
  }

  async choose(name: SetupName): Promise<void> {
    await this.inSheet(this.options[name], async () => {
      if ((await this.army.getAttribute("aria-pressed")) !== "true") await this.army.click();

      await this.options[name].click();
    });
  }

  /** The name of the pressed option, or undefined while none is — a scored game's setups open empty. */
  async getSelected(): Promise<SetupName | undefined> {
    for (const name of SETUP_NAMES) {
      if ((await this.options[name].getAttribute("aria-pressed")) === "true") return name;
    }

    return undefined;
  }
}

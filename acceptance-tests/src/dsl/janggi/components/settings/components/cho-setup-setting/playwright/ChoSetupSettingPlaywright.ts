import type {Locator, Page} from "@playwright/test";
import {SETUP_NAMES} from "@janggi/shared/janggi/settings/SetupName";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * Cho's opening-setup picker. The two armies choose separately, so each has its own picker and
 * its own component — a grid of buttons behind the army switch, driven as `HanSetupSettingPlaywright`
 * describes.
 */
export class ChoSetupSettingPlaywright extends SettingsSheetComponent {
  private readonly army: Locator;
  private readonly options: Record<SetupName, Locator>;

  constructor(page: Page) {
    super(page);

    this.army = page.getByTestId("setup-army-cho");
    this.options = {
      "Inner Elephant": page.getByTestId("cho-setup-option-inner-elephant"),
      "Outer Elephant": page.getByTestId("cho-setup-option-outer-elephant"),
      "Left Elephant": page.getByTestId("cho-setup-option-left-elephant"),
      "Right Elephant": page.getByTestId("cho-setup-option-right-elephant"),
      "Central Chariot": page.getByTestId("cho-setup-option-central-chariot"),
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

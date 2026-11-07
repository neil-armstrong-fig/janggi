import {SetupSetting} from "@src/dsl/janggi/components/settings/tabs/play-pane/playwright/components/setup-setting/SetupSetting";
import type {Locator, Page} from "@playwright/test";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * Cho's opening-setup picker. The two armies choose separately, so each has its own picker and
 * its own component — a grid of buttons behind the army switch, driven as `HanSetupSettingPlaywright`
 * describes.
 */
export class ChoSetupSettingPlaywright extends SettingsSheetComponent {
  private readonly army: Locator;
  private readonly grid: Locator;
  private readonly options: Record<SetupName, Locator>;
  private readonly setupSetting: SetupSetting;

  constructor(page: Page) {
    super(page);

    this.army = page.getByTestId("setup-army-cho");
    this.grid = page.getByTestId("cho-setup-grid");
    this.options = {
      "Inner Elephant": page.getByTestId("cho-setup-option-inner-elephant"),
      "Outer Elephant": page.getByTestId("cho-setup-option-outer-elephant"),
      "Left Elephant": page.getByTestId("cho-setup-option-left-elephant"),
      "Right Elephant": page.getByTestId("cho-setup-option-right-elephant"),
      "Central Chariot": page.getByTestId("cho-setup-option-central-chariot"),
    };

    this.setupSetting = new SetupSetting({army: this.army, grid: this.grid, options: this.options});
  }

  async show(): Promise<void> {
    await this.inSheet(this.army, () => this.setupSetting.show());
  }

  /**
   * Whether this army's grid is the one the switch shows — the other's is hidden, not removed. Read off `hidden`, so
   * it answers the same with the sheet shut or the setups folded away.
   */
  async isShown(): Promise<boolean> {
    return await this.setupSetting.isShown();
  }

  /** Whether the picker is still live — the pickers lock once a move has been played, all options at once. */
  async isChoosable(): Promise<boolean> {
    return await this.setupSetting.isChoosable();
  }

  async choose(name: SetupName): Promise<void> {
    await this.inSheet(this.options[name], () => this.setupSetting.choose(name));
  }

  /** The name of the pressed option, or undefined while none is — a scored game's setups open empty. */
  async getSelected(): Promise<SetupName | undefined> {
    return await this.setupSetting.getSelected();
  }
}

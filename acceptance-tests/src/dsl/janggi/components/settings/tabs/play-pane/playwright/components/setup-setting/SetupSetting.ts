import type {Locator} from "@playwright/test";
import {SETUP_NAMES} from "@janggi/shared/janggi/settings/SetupName";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import {OptionPicker} from "@src/dsl/janggi/components/settings/playwright/components/option-picker/OptionPicker";
import type {SetupSettingControls} from "@src/dsl/janggi/components/settings/tabs/play-pane/playwright/components/setup-setting/types/SetupSettingControls";

/** One army's grid, with the army switch that brings it into view. */
export class SetupSetting {
  private readonly army: Locator;
  private readonly grid: Locator;
  private readonly options: Readonly<Record<SetupName, Locator>>;
  private readonly optionPicker: OptionPicker<SetupName>;

  constructor(setupSettingControls: SetupSettingControls) {
    this.army = setupSettingControls.army;
    this.grid = setupSettingControls.grid;
    this.options = setupSettingControls.options;
    this.optionPicker = new OptionPicker(this.grid, SETUP_NAMES);
  }

  async choose(name: SetupName): Promise<void> {
    await this.show();
    await this.options[name].click();
  }

  async show(): Promise<void> {
    if ((await this.army.getAttribute("aria-pressed")) !== "true") await this.army.click();
  }

  async isShown(): Promise<boolean> {
    return ((await this.grid.getAttribute("hidden")) ?? undefined) === undefined;
  }

  async isChoosable(): Promise<boolean> {
    return await this.options["Inner Elephant"].isEnabled();
  }

  async getSelected(): Promise<SetupName | undefined> {
    await this.options["Inner Elephant"].waitFor({state: "attached"});
    return await this.optionPicker.getSelected();
  }
}

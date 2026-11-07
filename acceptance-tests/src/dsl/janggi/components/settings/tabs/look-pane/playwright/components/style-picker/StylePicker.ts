import type {Locator} from "@playwright/test";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {OnOffSwitch} from "@src/dsl/janggi/components/settings/playwright/components/on-off-switch/OnOffSwitch";
import type {StylePickerControls} from "@src/dsl/janggi/components/settings/tabs/look-pane/playwright/components/style-picker/types/StylePickerControls";

/** The native style picker and the separate selections it can expose for each army. */
export class StylePicker<Name extends string> {
  private readonly select: Locator;
  private readonly splitSwitch: OnOffSwitch;
  private readonly armySelects: Readonly<Record<Side, Locator>>;
  private readonly options: Readonly<Record<Name, Locator>>;
  private readonly names: readonly Name[];
  private readonly selectOptions: Locator;

  constructor(stylePickerControls: StylePickerControls<Name>, names: readonly Name[]) {
    this.select = stylePickerControls.select;
    this.splitSwitch = new OnOffSwitch(stylePickerControls.split);
    this.armySelects = stylePickerControls.armySelects;
    this.options = stylePickerControls.options;
    this.names = names;
    this.selectOptions = this.select.locator("option");
  }

  async getOptionValue(name: Name): Promise<string> {
    const value = (await this.options[name].getAttribute("value")) ?? undefined;
    if (value === undefined) throw new Error(`The "${name}" option carries no value to select`);

    return value;
  }

  async chooseNamed(name: string): Promise<void> {
    await this.select.selectOption(name);
  }

  async isChosenApart(): Promise<boolean> {
    return (await this.splitSwitch.getSelected()) === true;
  }

  async toggleChoosingApart(): Promise<void> {
    await this.splitSwitch.press();
  }

  async chooseForArmy(side: Side, name: string): Promise<void> {
    await this.armySelects[side].selectOption(name);
  }

  async getSelectedNameForArmy(side: Side): Promise<string> {
    return await this.armySelects[side].inputValue();
  }

  async getSelected(): Promise<Name | undefined> {
    const name = await this.getSelectedName();
    return this.names.find(candidate => candidate === name);
  }

  async getSelectedName(): Promise<string> {
    return await this.select.inputValue();
  }

  async getBuiltInOrder(): Promise<Name[]> {
    const values = await this.selectOptions.evaluateAll(options => options.map(option => option.getAttribute("value")));
    return values.flatMap(value => {
      const name = this.names.find(candidate => candidate === value);
      if (name === undefined) return [];
      return [name];
    });
  }

  async isLocked(name: Name): Promise<boolean> {
    return ((await this.options[name].getAttribute("data-locked")) ?? undefined) !== undefined;
  }
}

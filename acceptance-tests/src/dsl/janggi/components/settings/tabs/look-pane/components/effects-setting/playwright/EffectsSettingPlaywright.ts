import {Switch} from "@src/dsl/janggi/components/settings/playwright/components/switch/Switch";
import type {Locator, Page} from "@playwright/test";
import type {EffectsName} from "@janggi/shared/janggi/settings/EffectsName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * The switch for how much the board moves.
 *
 * A switch, where the player once had two buttons to choose between; the spec still says which of the two
 * names it wants, and this turns the switch only if it is not already there. `aria-pressed` is the state.
 */
export class EffectsSettingPlaywright extends SettingsSheetComponent {
  private readonly toggle: Locator;
  private readonly settingSwitch: Switch<EffectsName>;

  constructor(page: Page) {
    super(page);

    this.toggle = page.getByTestId("effects-toggle");

    this.settingSwitch = new Switch(this.toggle, "Full", "Reduced");
  }

  async choose(name: EffectsName): Promise<void> {
    if ((await this.getSelected()) === name) return;

    await this.inSheet(this.toggle, () => this.settingSwitch.press());
  }

  /** The name the switch stands for, or undefined before anything has rendered. */
  async getSelected(): Promise<EffectsName | undefined> {
    return await this.settingSwitch.getSelected();
  }
}

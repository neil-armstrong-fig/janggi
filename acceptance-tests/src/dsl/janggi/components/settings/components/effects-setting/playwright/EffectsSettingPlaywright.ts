import {EFFECTS_NAMES} from "@janggi/shared/janggi/settings/EffectsName";
import type {EffectsName} from "@janggi/shared/janggi/settings/EffectsName";
import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/** The picker for how much the board moves: one locator per option, spelled out as every picker's are. */
export class EffectsSettingPlaywright extends SettingsSheetComponent {
  private readonly picker: Locator;
  private readonly options: Record<EffectsName, Locator>;

  constructor(page: Page) {
    super(page);

    this.picker = page.getByTestId("effects-picker");
    this.options = {
      Full: page.getByTestId("effects-option-full"),
      Reduced: page.getByTestId("effects-option-reduced"),
    };
  }

  async choose(name: EffectsName): Promise<void> {
    await this.inSheet(() => this.options[name].click());
  }

  /** The name on whichever button is pressed, or undefined before anything has rendered. */
  async getSelected(): Promise<EffectsName | undefined> {
    const pressed = this.picker.locator("[aria-pressed='true']");
    if ((await pressed.count()) === 0) return undefined;

    const name = await pressed.textContent();

    return EFFECTS_NAMES.find(candidate => candidate === name);
  }
}

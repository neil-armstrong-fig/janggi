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

  constructor(page: Page) {
    super(page);

    this.toggle = page.getByTestId("effects-toggle");
  }

  async choose(name: EffectsName): Promise<void> {
    if ((await this.getSelected()) === name) return;

    await this.inSheet(this.toggle, () => this.toggle.click());
  }

  /** The name the switch stands for, or undefined before anything has rendered. */
  async getSelected(): Promise<EffectsName | undefined> {
    const pressed = await this.toggle.getAttribute("aria-pressed");
    if (pressed === null) return undefined;

    if (pressed === "true") return "Full";

    return "Reduced";
  }
}

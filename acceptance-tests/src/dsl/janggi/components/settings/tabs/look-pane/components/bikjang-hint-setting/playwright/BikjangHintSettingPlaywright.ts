import {VisibilitySwitch} from "@src/dsl/janggi/components/settings/tabs/look-pane/playwright/components/visibility-switch/VisibilitySwitch";
import type {Locator, Page} from "@playwright/test";
import type {BikjangHintName} from "@janggi/shared/janggi/settings/BikjangHintName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * The switch for whether a move that could allow a bikjang is labelled.
 *
 * A switch, where the player once had two buttons to choose between; the spec still says which of the two
 * names it wants, and this turns the switch only if it is not already there. `aria-pressed` is the state.
 */
export class BikjangHintSettingPlaywright extends SettingsSheetComponent {
  private readonly toggle: Locator;
  private readonly visibilitySwitch: VisibilitySwitch;

  constructor(page: Page) {
    super(page);

    this.toggle = page.getByTestId("bikjang-hint-toggle");

    this.visibilitySwitch = new VisibilitySwitch(this.toggle);
  }

  async choose(name: BikjangHintName): Promise<void> {
    if ((await this.getSelected()) === name) return;

    await this.inSheet(this.toggle, () => this.visibilitySwitch.press());
  }

  /** The name the switch stands for, or undefined before anything has rendered. */
  async getSelected(): Promise<BikjangHintName | undefined> {
    return await this.visibilitySwitch.getSelected();
  }
}

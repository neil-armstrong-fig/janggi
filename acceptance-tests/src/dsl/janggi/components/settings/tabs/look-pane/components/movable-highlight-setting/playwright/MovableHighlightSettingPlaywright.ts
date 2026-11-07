import {VisibilitySwitch} from "@src/dsl/janggi/components/settings/tabs/look-pane/playwright/components/visibility-switch/VisibilitySwitch";
import type {Locator, Page} from "@playwright/test";
import type {MovableHighlightName} from "@janggi/shared/janggi/settings/MovableHighlightName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * The switch for whether the movable pieces are marked.
 *
 * A switch, where the player once had two buttons to choose between; the spec still says which of the two
 * names it wants, and this turns the switch only if it is not already there. `aria-pressed` is the state.
 */
export class MovableHighlightSettingPlaywright extends SettingsSheetComponent {
  private readonly toggle: Locator;
  private readonly visibilitySwitch: VisibilitySwitch;

  constructor(page: Page) {
    super(page);

    this.toggle = page.getByTestId("movable-highlight-toggle");

    this.visibilitySwitch = new VisibilitySwitch(this.toggle);
  }

  async choose(name: MovableHighlightName): Promise<void> {
    if ((await this.getSelected()) === name) return;

    await this.inSheet(this.toggle, () => this.visibilitySwitch.press());
  }

  /** The words beside the switch. */
  async getLabel(): Promise<string> {
    return ((await this.toggle.textContent()) ?? "").trim();
  }

  /** The name the switch stands for, or undefined before anything has rendered. */
  async getSelected(): Promise<MovableHighlightName | undefined> {
    return await this.visibilitySwitch.getSelected();
  }
}

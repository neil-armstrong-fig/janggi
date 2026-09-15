import type {Locator, Page} from "@playwright/test";
import {OPPONENT_NAMES} from "@janggi/shared/janggi/settings/OpponentName";
import type {OpponentName} from "@janggi/shared/janggi/settings/OpponentName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * The picker for who plays the other army — someone at the same device, or the bot. Two options, so a
 * row of buttons with the chosen one pressed, the same shape as the match format beside it.
 */
export class OpponentSettingPlaywright extends SettingsSheetComponent {
  private readonly picker: Locator;
  private readonly options: Record<OpponentName, Locator>;

  constructor(page: Page) {
    super(page);

    this.picker = page.getByTestId("opponent-picker");
    this.options = {
      Human: page.getByTestId("opponent-option-human"),
      Bot: page.getByTestId("opponent-option-bot"),
    };
  }

  async choose(name: OpponentName): Promise<void> {
    await this.inSheet(this.picker, () => this.options[name].click());
  }

  /** The name on whichever button is pressed, or undefined before anything has rendered. */
  async getSelected(): Promise<OpponentName | undefined> {
    const pressed = this.picker.locator("[aria-pressed='true']");
    if ((await pressed.count()) === 0) return undefined;

    const name = await pressed.textContent();

    return OPPONENT_NAMES.find(candidate => candidate === name);
  }

  /** Whether the opponent may still be chosen, which the buttons say by being enabled or not. */
  async isChoosable(): Promise<boolean> {
    const human = this.options.Human;
    await human.waitFor({state: "visible"});

    return await human.isEnabled();
  }
}

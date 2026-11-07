import {OptionPicker} from "@src/dsl/janggi/components/settings/playwright/components/option-picker/OptionPicker";
import type {Locator, Page} from "@playwright/test";
import {SIDE_CHOICE_NAMES} from "@janggi/shared/janggi/settings/SideChoiceName";
import type {SideChoiceName} from "@janggi/shared/janggi/settings/SideChoiceName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * The picker for which army the player takes against the bot. Three short names, so a row of
 * buttons, and it is only laid out while the opponent is the bot.
 */
export class YourSideSettingPlaywright extends SettingsSheetComponent {
  private readonly botSettings: Locator;
  private readonly options: Record<SideChoiceName, Locator>;
  private readonly optionPicker: OptionPicker<SideChoiceName>;

  constructor(page: Page) {
    super(page);

    this.botSettings = page.getByTestId("bot-settings");
    this.options = {
      Cho: page.getByTestId("your-side-option-cho"),
      Han: page.getByTestId("your-side-option-han"),
      Random: page.getByTestId("your-side-option-random"),
    };
    this.optionPicker = new OptionPicker(page.getByTestId("your-side-picker"), SIDE_CHOICE_NAMES);
  }

  /**
   * Whether the picker is laid out at all, which it is only against the bot. Read off the bot's settings' `hidden`, so
   * it answers the same with the sheet shut or the opponent's group folded away.
   */
  async isShown(): Promise<boolean> {
    return (await this.botSettings.getAttribute("hidden")) === null;
  }

  async isChoosable(): Promise<boolean> {
    return await this.options.Cho.isEnabled();
  }

  async choose(name: SideChoiceName): Promise<void> {
    await this.inSheet(this.options[name], async () => {
      await this.options[name].click();
    });
  }

  async getSelected(): Promise<SideChoiceName | undefined> {
    await this.options.Cho.waitFor({state: "attached"});
    return await this.optionPicker.getSelected();
  }
}

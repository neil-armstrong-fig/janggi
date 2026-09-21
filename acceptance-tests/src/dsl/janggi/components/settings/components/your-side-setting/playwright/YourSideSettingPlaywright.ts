import type {Locator, Page} from "@playwright/test";
import {SIDE_CHOICE_NAMES} from "@janggi/shared/janggi/settings/SideChoiceName";
import type {SideChoiceName} from "@janggi/shared/janggi/settings/SideChoiceName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * The picker for which army the player takes against the bot. Three short names, so a row of
 * buttons, and it is only laid out while the opponent is the bot.
 */
export class YourSideSettingPlaywright extends SettingsSheetComponent {
  private readonly picker: Locator;
  private readonly options: Record<SideChoiceName, Locator>;

  constructor(page: Page) {
    super(page);

    this.picker = page.getByTestId("your-side-picker");
    this.options = {
      Cho: page.getByTestId("your-side-option-cho"),
      Han: page.getByTestId("your-side-option-han"),
      Random: page.getByTestId("your-side-option-random"),
    };
  }

  /** Whether the picker is laid out at all, which it is only against the bot. */
  async isShown(): Promise<boolean> {
    return await this.picker.isVisible();
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
    for (const name of SIDE_CHOICE_NAMES) {
      if ((await this.options[name].getAttribute("aria-pressed")) === "true") return name;
    }

    return undefined;
  }
}

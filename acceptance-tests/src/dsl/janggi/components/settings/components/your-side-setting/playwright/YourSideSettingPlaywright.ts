import type {Locator, Page} from "@playwright/test";
import {SIDE_CHOICE_NAMES} from "@janggi/shared/janggi/settings/SideChoiceName";
import type {SideChoiceName} from "@janggi/shared/janggi/settings/SideChoiceName";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/** The picker for which army the player takes against the bot. Three options, so a native select. */
export class YourSideSettingPlaywright extends SettingsSheetComponent {
  private readonly select: Locator;
  private readonly options: Record<SideChoiceName, Locator>;

  constructor(page: Page) {
    super(page);

    this.select = page.getByTestId("your-side-select");
    this.options = {
      Cho: page.getByTestId("your-side-option-cho"),
      Han: page.getByTestId("your-side-option-han"),
      Random: page.getByTestId("your-side-option-random"),
    };
  }

  async isChoosable(): Promise<boolean> {
    return await this.select.isEnabled();
  }

  async choose(name: SideChoiceName): Promise<void> {
    const value = await this.options[name].getAttribute("value");
    if (value === null) throw new Error(`The "${name}" option carries no value to select`);

    await this.inSheet(this.select, async () => {
      await this.select.selectOption(value);
    });
  }

  async getSelected(): Promise<SideChoiceName | undefined> {
    const name = await this.select.locator("option:checked").textContent();

    return SIDE_CHOICE_NAMES.find(candidate => candidate === name);
  }
}

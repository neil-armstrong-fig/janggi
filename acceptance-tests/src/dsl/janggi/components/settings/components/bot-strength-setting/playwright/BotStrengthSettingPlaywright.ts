import type {Locator, Page} from "@playwright/test";
import {BOT_ELOS} from "@janggi/shared/janggi/settings/BotElo";
import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * The picker for how strong the bot plays, named by Elo. More than two options, so a native select
 * whose options carry the ids — spelled out here rather than recomputed from the Elo, the same as
 * every other picker.
 */
export class BotStrengthSettingPlaywright extends SettingsSheetComponent {
  private readonly select: Locator;
  private readonly options: Record<BotElo, Locator>;

  constructor(page: Page) {
    super(page);

    this.select = page.getByTestId("bot-strength-select");
    this.options = {
      800: page.getByTestId("bot-strength-option-800"),
      1000: page.getByTestId("bot-strength-option-1000"),
      1200: page.getByTestId("bot-strength-option-1200"),
      1400: page.getByTestId("bot-strength-option-1400"),
      1600: page.getByTestId("bot-strength-option-1600"),
      1900: page.getByTestId("bot-strength-option-1900"),
      2200: page.getByTestId("bot-strength-option-2200"),
      2850: page.getByTestId("bot-strength-option-2850"),
    };
  }

  async isChoosable(): Promise<boolean> {
    return await this.select.isEnabled();
  }

  async choose(elo: BotElo): Promise<void> {
    const value = await this.options[elo].getAttribute("value");
    if (value === null) throw new Error(`The ${elo} option carries no value to select`);

    await this.inSheet(this.select, async () => {
      await this.select.selectOption(value);
    });
  }

  async getSelected(): Promise<BotElo | undefined> {
    const shown = await this.select.locator("option:checked").textContent();

    return BOT_ELOS.find(candidate => String(candidate) === shown);
  }
}

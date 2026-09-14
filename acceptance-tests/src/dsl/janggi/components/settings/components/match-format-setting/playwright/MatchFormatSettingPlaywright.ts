import {MATCH_FORMATS} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Locator, Page} from "@playwright/test";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * The picker for which of the two games is being played — casual, or the KJA's scored tournament
 * format. It decides whether a bikjang may be called and whether one draws. See `docs/rules.md`
 * §6.2.
 *
 * The same shape as every other picker here, and for the same reason — the test ids are the
 * contract, so they are stated rather than recomputed from the option's name the way the webapp
 * builds them.
 */
export class MatchFormatSettingPlaywright extends SettingsSheetComponent {
  private readonly picker: Locator;
  private readonly options: Record<MatchFormat, Locator>;

  constructor(page: Page) {
    super(page);

    this.picker = page.getByTestId("match-format-picker");
    this.options = {
      Casual: page.getByTestId("match-format-option-casual"),
      Scored: page.getByTestId("match-format-option-scored"),
    };
  }

  async choose(name: MatchFormat): Promise<void> {
    await this.inSheet(() => this.options[name].click());
  }

  /** The name on whichever button is pressed, or undefined before anything has rendered. */
  async getSelected(): Promise<MatchFormat | undefined> {
    const pressed = this.picker.locator("[aria-pressed='true']");
    if ((await pressed.count()) === 0) return undefined;

    const name = await pressed.textContent();

    return MATCH_FORMATS.find(candidate => candidate === name);
  }

  /** Whether the format may still be chosen, which the buttons say by being enabled or not. */
  async isChoosable(): Promise<boolean> {
    const casual = this.options.Casual;
    await casual.waitFor({state: "visible"});

    return await casual.isEnabled();
  }
}

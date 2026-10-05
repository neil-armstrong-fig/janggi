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
  private readonly explain: Locator;
  private readonly explanation: Locator;

  constructor(page: Page) {
    super(page);

    this.picker = page.getByTestId("match-format-picker");
    this.options = {
      Casual: page.getByTestId("match-format-option-casual"),
      Scored: page.getByTestId("match-format-option-scored"),
    };
    this.explain = page.getByTestId("match-format-explain");
    this.explanation = page.getByTestId("match-format-explanation");
  }

  /** Presses the (?) beside the picker, which unfolds the explanation or folds it away again. */
  async toggleExplanation(): Promise<void> {
    await this.inSheet(this.explain, () => this.explain.click());
  }

  /**
   * Whether the explanation is drawn. Read off the panel itself rather than the toggle's `aria-expanded`,
   * because an attribute and an element that are both absent read the same.
   */
  async isExplanationShown(): Promise<boolean> {
    await this.picker.waitFor({state: "attached"});

    return (await this.explanation.count()) > 0;
  }

  async choose(name: MatchFormat): Promise<void> {
    await this.inSheet(this.picker, () => this.options[name].click());
  }

  /** The option on whichever button is pressed — read off `data-option`, not its words — or undefined before anything has rendered. */
  async getSelected(): Promise<MatchFormat | undefined> {
    const pressed = this.picker.locator("[aria-pressed='true']");
    if ((await pressed.count()) === 0) return undefined;

    const name = await pressed.getAttribute("data-option");

    return MATCH_FORMATS.find(candidate => candidate === name);
  }

  /** The words on one of the buttons, as written rather than as the stylesheet draws them. */
  async getOptionLabel(name: MatchFormat): Promise<string> {
    return ((await this.options[name].textContent()) ?? "").trim();
  }

  /** Whether the format may still be chosen, which the buttons say by being enabled or not. */
  async isChoosable(): Promise<boolean> {
    const casual = this.options.Casual;
    await casual.waitFor({state: "visible"});

    return await casual.isEnabled();
  }
}

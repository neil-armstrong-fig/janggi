import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";
import {TIME_CONTROL_NAMES} from "@janggi/shared/janggi/settings/TimeControlName";
import type {TimeControl} from "@janggi/shared/janggi/settings/TimeControl";
import type {TimeControlName} from "@janggi/shared/janggi/settings/TimeControlName";

/** The clock's picker in the Play tab, and the three fields Custom opens beneath it. */
export class ClockSettingPlaywright extends SettingsSheetComponent {
  private readonly setting: Locator;
  private readonly picker: Locator;
  private readonly options: Record<TimeControlName, Locator>;
  private readonly explain: Locator;
  private readonly explanation: Locator;
  private readonly minutes: Locator;
  private readonly periodSeconds: Locator;
  private readonly periods: Locator;

  constructor(page: Page) {
    super(page);

    this.setting = page.getByTestId("unreleased-clock-setting");
    this.picker = page.getByTestId("unreleased-clock-picker");
    this.options = {
      Off: page.getByTestId("unreleased-clock-option-off"),
      "5 min": page.getByTestId("unreleased-clock-option-5-min"),
      "10 min": page.getByTestId("unreleased-clock-option-10-min"),
      "20 min": page.getByTestId("unreleased-clock-option-20-min"),
      Custom: page.getByTestId("unreleased-clock-option-custom"),
    };
    this.explain = page.getByTestId("unreleased-clock-explain");
    this.explanation = page.getByTestId("unreleased-clock-explanation");
    this.minutes = page.getByTestId("unreleased-clock-custom-minutes");
    this.periodSeconds = page.getByTestId("unreleased-clock-custom-period-seconds");
    this.periods = page.getByTestId("unreleased-clock-custom-periods");
  }

  async choose(name: TimeControlName): Promise<void> {
    await this.inSheet(this.picker, () => this.options[name].click());
  }

  async writeOut({minutes, periodSeconds, periods}: TimeControl): Promise<void> {
    await this.inSheet(this.picker, async () => {
      await this.options.Custom.click();
      await this.minutes.fill(String(minutes));
      await this.periodSeconds.fill(String(periodSeconds));
      await this.periods.fill(String(periods));
    });
  }

  async toggleExplanation(): Promise<void> {
    await this.inSheet(this.explain, () => this.explain.click());
  }

  /** Read off the panel itself, which is only drawn while it is unfolded. */
  async isExplanationShown(): Promise<boolean> {
    await this.picker.waitFor({state: "attached"});

    return (await this.explanation.count()) > 0;
  }

  async getExplanationWords(): Promise<string> {
    let words = "";
    await this.inSheet(this.explain, async () => {
      words = await this.explanation.innerText();
    });

    return words;
  }

  /** The option on whichever button is pressed, read off `data-option` rather than its words. */
  async getSelected(): Promise<TimeControlName | undefined> {
    const name = await this.picker.locator("[aria-pressed='true']").getAttribute("data-option");

    return TIME_CONTROL_NAMES.find(candidate => candidate === name);
  }

  /** Read off `hidden`, since the sheet is out of sight whether or not the setting is offered. */
  async isOffered(): Promise<boolean> {
    await this.setting.waitFor({state: "attached"});

    return (await this.setting.getAttribute("hidden")) === null;
  }
}

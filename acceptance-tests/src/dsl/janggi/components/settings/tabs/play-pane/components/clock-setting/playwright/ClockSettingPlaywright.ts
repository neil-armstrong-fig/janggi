import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";
import {TIME_CONTROL_NAMES} from "@janggi/shared/janggi/settings/TimeControlName";
import type {TimeControl} from "@janggi/shared/janggi/settings/TimeControl";
import type {TimeControlFigure} from "@janggi/shared/janggi/settings/TimeControlFigure";
import type {TimeControlFormat, TimeControlName} from "@janggi/shared/janggi/settings/TimeControlName";

/** The clock's switch in the Play tab, the picker it opens, and the three fields Custom opens beneath that. */
export class ClockSettingPlaywright extends SettingsSheetComponent {
  private readonly setting: Locator;
  private readonly toggle: Locator;
  private readonly picker: Locator;
  private readonly options: Record<TimeControlFormat, Locator>;
  private readonly explain: Locator;
  private readonly explanation: Locator;
  private readonly figures: Record<TimeControlFigure, Locator>;

  constructor(page: Page) {
    super(page);

    this.setting = page.getByTestId("clock-setting");
    this.toggle = page.getByTestId("clock-toggle");
    this.picker = page.getByTestId("clock-picker");
    this.options = {
      "5 min": page.getByTestId("clock-option-5-min"),
      "10 min": page.getByTestId("clock-option-10-min"),
      "20 min": page.getByTestId("clock-option-20-min"),
      Custom: page.getByTestId("clock-option-custom"),
    };
    this.explain = page.getByTestId("clock-explain");
    this.explanation = page.getByTestId("clock-explanation");
    this.figures = {
      minutes: page.getByTestId("clock-custom-minutes"),
      periodSeconds: page.getByTestId("clock-custom-period-seconds"),
      periods: page.getByTestId("clock-custom-periods"),
    };
  }

  async turnOn(): Promise<void> {
    await this.inSheet(this.toggle, () => this.pressToggleIf(false));
  }

  async turnOff(): Promise<void> {
    await this.inSheet(this.toggle, () => this.pressToggleIf(true));
  }

  async choose(format: TimeControlFormat): Promise<void> {
    await this.inSheet(this.toggle, async () => {
      await this.pressToggleIf(false);
      await this.options[format].click();
    });
  }

  async writeOut({minutes, periodSeconds, periods}: TimeControl): Promise<void> {
    await this.inSheet(this.toggle, async () => {
      await this.pressToggleIf(false);
      await this.options.Custom.click();
      await this.figures.minutes.fill(String(minutes));
      await this.figures.periodSeconds.fill(String(periodSeconds));
      await this.figures.periods.fill(String(periods));
      await this.figures.periods.blur();
    });
  }

  private async pressToggleIf(on: boolean): Promise<void> {
    if ((await this.isOn()) === on) await this.toggle.click();
  }

  private async isOn(): Promise<boolean> {
    return (await this.toggle.getAttribute("aria-pressed")) === "true";
  }

  async typeFigure(figure: TimeControlFigure, typed: string): Promise<void> {
    await this.inSheet(this.picker, async () => {
      const field = this.figures[figure];

      await field.fill("");
      await field.pressSequentially(typed);
      await field.blur();
    });
  }

  /** Read off the field's value, which is there whether or not the sheet is open. */
  async getFigure(figure: TimeControlFigure): Promise<string> {
    return await this.figures[figure].inputValue();
  }

  async toggleExplanation(): Promise<void> {
    await this.inSheet(this.explain, () => this.explain.click());
  }

  /** Read off the panel itself, which is only drawn while it is unfolded. */
  async isExplanationShown(): Promise<boolean> {
    await this.setting.waitFor({state: "attached"});

    return (await this.explanation.count()) > 0;
  }

  async getExplanationWords(): Promise<string> {
    let words = "";
    await this.inSheet(this.explain, async () => {
      words = await this.explanation.innerText();
    });

    return words;
  }

  /** Whether the formats are there to choose from, which they only are with the clock on. */
  async areFormatsShown(): Promise<boolean> {
    await this.setting.waitFor({state: "attached"});

    return (await this.picker.count()) > 0;
  }

  /** Off where the switch is, and otherwise the option on whichever button is pressed, read off `data-option`. */
  async getSelected(): Promise<TimeControlName | undefined> {
    if (!(await this.isOn())) return "Off";

    const name = await this.picker.locator("[aria-pressed='true']").getAttribute("data-option");

    return TIME_CONTROL_NAMES.find(candidate => candidate === name);
  }

  async canChange(): Promise<boolean> {
    return await this.toggle.isEnabled();
  }

  async canWriteOut(): Promise<boolean> {
    return await this.figures.minutes.isEnabled();
  }

  /** Read off `hidden`, since the sheet is out of sight whether or not the setting is offered. */
  async isOffered(): Promise<boolean> {
    await this.setting.waitFor({state: "attached"});

    return (await this.setting.getAttribute("hidden")) === null;
  }
}

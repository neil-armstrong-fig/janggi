import {OnOffSwitch} from "@src/dsl/janggi/components/settings/playwright/components/on-off-switch/OnOffSwitch";
import {OptionPicker} from "@src/dsl/janggi/components/settings/playwright/components/option-picker/OptionPicker";
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
  private readonly optionPicker: OptionPicker<TimeControlName>;
  private readonly onOffSwitch: OnOffSwitch;

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

    this.optionPicker = new OptionPicker(this.picker, TIME_CONTROL_NAMES);

    this.onOffSwitch = new OnOffSwitch(this.toggle);
  }

  async turnOn(): Promise<void> {
    await this.inSheet(this.toggle, () => this.onOffSwitch.choose(true));
  }

  async turnOff(): Promise<void> {
    await this.inSheet(this.toggle, () => this.onOffSwitch.choose(false));
  }

  async choose(format: TimeControlFormat): Promise<void> {
    await this.inSheet(this.toggle, async () => {
      await this.onOffSwitch.choose(true);
      await this.options[format].click();
    });
  }

  async writeOut({minutes, periodSeconds, periods}: TimeControl): Promise<void> {
    await this.inSheet(this.toggle, async () => {
      await this.onOffSwitch.choose(true);
      await this.options.Custom.click();
      await this.figures.minutes.fill(String(minutes));
      await this.figures.periodSeconds.fill(String(periodSeconds));
      await this.figures.periods.fill(String(periods));
      await this.figures.periods.blur();
    });
  }

  /** Read off the field's value, which is there whether or not the sheet is open. */
  async typeFigure(figure: TimeControlFigure, typed: string): Promise<void> {
    await this.inSheet(this.picker, async () => {
      const field = this.figures[figure];

      await field.fill("");
      await field.pressSequentially(typed);
      await field.blur();
    });
  }

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
    return await this.inSheet(this.explain, () => this.explanation.innerText());
  }

  /** Whether the formats are there to choose from, which they only are with the clock on. */
  async areFormatsShown(): Promise<boolean> {
    await this.setting.waitFor({state: "attached"});

    return (await this.picker.count()) > 0;
  }

  /** Off where the switch is, and otherwise the option on whichever button is pressed, read off `data-option`. */
  async getSelected(): Promise<TimeControlName | undefined> {
    const on = await this.onOffSwitch.getSelected();
    if (on === undefined) return undefined;

    if (!on) return "Off";

    return await this.optionPicker.waitForSelected();
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

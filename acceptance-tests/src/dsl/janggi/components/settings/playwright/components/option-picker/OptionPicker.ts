import type {Locator} from "@playwright/test";
import type {OptionAttribute} from "@src/dsl/janggi/components/settings/playwright/components/option-picker/types/OptionAttribute";

/** Reads selection in the button form of React's OptionPicker, independently of translated labels. */
export class OptionPicker<Choice extends string> {
  private readonly selectedOption: Locator;

  constructor(
    picker: Locator,
    private readonly choices: readonly Choice[],
    private readonly choiceAttribute: OptionAttribute = "data-option",
  ) {
    this.selectedOption = picker.getByRole("button", {pressed: true, includeHidden: true});
  }

  /** A missing selection is an answer, including before the picker has rendered. */
  async getSelected(): Promise<Choice | undefined> {
    if ((await this.selectedOption.count()) === 0) return undefined;

    return await this.waitForSelected();
  }

  /** For a control whose selection must already exist: retain Playwright's normal attachment wait. */
  async waitForSelected(): Promise<Choice | undefined> {
    const value = await this.selectedOption.getAttribute(this.choiceAttribute);
    return this.choices.find(choice => choice === value);
  }
}

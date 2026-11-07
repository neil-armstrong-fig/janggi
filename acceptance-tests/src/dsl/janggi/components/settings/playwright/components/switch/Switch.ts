import type {Locator} from "@playwright/test";
import type {SwitchValue} from "@src/dsl/janggi/components/settings/playwright/components/switch/types/SwitchValue";

/** A switch's pressed state, expressed using the owning setting's vocabulary. */
export class Switch<Choice extends SwitchValue> {
  private readonly toggle: Locator;
  private readonly onChoice: Choice;
  private readonly offChoice: Choice;

  constructor(toggle: Locator, onChoice: Choice, offChoice: Choice) {
    this.toggle = toggle;
    this.onChoice = onChoice;
    this.offChoice = offChoice;
  }

  async choose(choice: Choice): Promise<void> {
    if ((await this.getSelected()) === choice) return;
    await this.press();
  }

  async press(): Promise<void> {
    await this.toggle.click();
  }

  async getSelected(): Promise<Choice | undefined> {
    const pressed = (await this.toggle.getAttribute("aria-pressed")) ?? undefined;
    if (pressed === undefined) return undefined;

    if (pressed === "true") return this.onChoice;
    return this.offChoice;
  }
}

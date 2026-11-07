import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/** The frame every style being made is drawn in: its name, Save, and the Controls/Raw JSON toggle. */
export class StyleEditorPlaywright extends BaseComponent {
  private readonly name: Locator;
  private readonly saveButton: Locator;
  private readonly message: Locator;
  private readonly rawToggle: Locator;
  private readonly controlsToggle: Locator;
  private readonly json: Locator;
  private readonly rawMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.name = page.getByTestId("style-editor-name");
    this.saveButton = page.getByTestId("style-editor-save");
    this.message = page.getByTestId("style-editor-message");
    this.rawToggle = page.getByTestId("style-editor-raw");
    this.controlsToggle = page.getByTestId("style-editor-controls");
    this.json = page.getByTestId("style-editor-json");
    this.rawMessage = page.getByTestId("style-editor-raw-message");
  }

  /** Saves the style being made, under `name` where one is given, and waits to be told how it went. */
  async save(name: string | undefined): Promise<void> {
    if (name !== undefined) await this.name.fill(name);
    await this.saveButton.click();
    await this.message.waitFor({state: "attached"});
  }

  async getMessage(): Promise<string> {
    return (await this.message.textContent()) ?? "";
  }

  async getRawMessage(): Promise<string> {
    return (await this.rawMessage.textContent()) ?? "";
  }

  async isRefused(): Promise<boolean> {
    return (await this.message.getAttribute("data-accepted")) === "false";
  }

  /** What the name box holds. */
  async getName(): Promise<string> {
    return await this.name.inputValue();
  }

  async showRaw(): Promise<void> {
    await this.rawToggle.click();
  }

  async showControls(): Promise<void> {
    await this.controlsToggle.click();
  }

  async getRaw(): Promise<string> {
    return await this.json.inputValue();
  }

  async getRawLinesShown(): Promise<number> {
    return await this.json.evaluate(element => {
      const {lineHeight, paddingTop, paddingBottom} = getComputedStyle(element);
      const inside = element.clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);

      return Math.round(inside / parseFloat(lineHeight));
    });
  }

  async setRaw(json: string): Promise<void> {
    await this.json.fill(json);
  }

  /** Whether the raw view is telling the player what is wrong with what they typed. */
  async isRawRefused(): Promise<boolean> {
    return (await this.rawMessage.count()) > 0;
  }
}

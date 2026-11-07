import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import type {Locator, Page} from "@playwright/test";

/**
 * The switch at the head of a reading page (the guide, the references) that toggles between the page's languages. Each
 * language is named in itself, the one the page is in is marked, and pressing either name leads to the other language.
 */
export class LanguageSwitchPlaywright extends BaseComponent {
  private readonly choices: Record<LanguageName, Locator>;

  constructor(page: Page) {
    super(page);

    this.choices = {en: page.getByTestId("page-language-en"), ko: page.getByTestId("page-language-ko")};
  }

  /** What each language is called on the switch. */
  async getNames(): Promise<Readonly<Record<LanguageName, string>>> {
    return {
      en: ((await this.choices.en.textContent()) ?? "").trim(),
      ko: ((await this.choices.ko.textContent()) ?? "").trim(),
    };
  }

  /** The language the page is in, as the switch marks it. */
  async getSelection(): Promise<LanguageName | undefined> {
    if ((await this.choices.en.getAttribute("data-current")) === "true") return "en";
    if ((await this.choices.ko.getAttribute("data-current")) === "true") return "ko";

    return undefined;
  }

  async isTextSelectable(): Promise<boolean> {
    return await this.choices.en.evaluate(element => getComputedStyle(element).userSelect !== "none");
  }

  async press(language: LanguageName): Promise<void> {
    await this.choices[language].click();
    await this.page.waitForLoadState("load");
  }

  async switchTo(language: LanguageName): Promise<void> {
    await this.press(language);
  }
}

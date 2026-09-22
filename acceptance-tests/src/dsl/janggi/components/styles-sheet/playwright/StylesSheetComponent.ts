import type {Locator, Page} from "@playwright/test";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/**
 * A part of the screen that lives in the styles sheet — the list of a player's own styles, or the editor
 * that makes one — reached from the settings sheet's Appearance section, which it slides up over and
 * replaces on screen. Every `*Playwright` under `styles-sheet/` extends this rather than holding one,
 * for the reason `SettingsSheetComponent` gives for its own children.
 *
 * `inStyles` opens the styles sheet, does something in it, and closes it again, so a spec reads the same
 * whether or not the sheet happens to be open already — the same shape `SettingsSheetComponent.inSheet`
 * gives every setting. `inStyleList` is the same, for an action on the list of a player's own styles: a
 * style being made is kept while the sheet is closed, so it puts one down first if one is open, the list
 * sitting behind the editor on screen.
 */
export abstract class StylesSheetComponent extends SettingsSheetComponent {
  private readonly stylesOpener: Locator;
  private readonly stylesCloser: Locator;
  private readonly closed: Locator;
  private readonly editorBack: Locator;

  protected constructor(page: Page) {
    super(page);

    this.stylesOpener = page.getByTestId("styles-open");
    this.stylesCloser = page.getByTestId("styles-close");
    this.closed = page.locator("[data-testid='styles'][inert]");
    this.editorBack = page.getByTestId("style-editor-back");
  }

  /** Opens the styles sheet by way of the settings sheet, does something in it, and closes it again. */
  protected async inStyles(act: () => Promise<void>): Promise<void> {
    await this.openSheet(this.stylesOpener);
    await this.stylesOpener.click();

    await act();

    await this.stylesCloser.click();
    await this.closed.waitFor({state: "attached"});
  }

  /** As `inStyles`, for what is done to the list of styles: a style being made is put down first. */
  protected async inStyleList(act: () => Promise<void>): Promise<void> {
    await this.inStyles(async () => {
      if (await this.editorBack.isVisible()) await this.editorBack.click();

      await act();
    });
  }
}

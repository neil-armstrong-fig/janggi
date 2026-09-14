import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/**
 * A part of the screen that lives in the settings sheet, which stays closed until it is asked for.
 *
 * Reading one needs nothing: the sheet is always in the page, only moved out of sight, so a pressed
 * option, a disabled picker or the pairing line reads the same with the sheet open or shut.
 * **Pressing one needs the sheet open**, and `inSheet` is that — open it, act, close it again — so
 * the sheet is out of the way before the next line of a spec taps the board it would be covering.
 * That is what lets every spec choose a setting exactly as it did before there was a sheet.
 *
 * A base class rather than a component another `*Playwright` holds, so each picker still owns only
 * its own locators and nothing becomes anybody's parent. Here rather than in `src/dsl/playwright/`
 * because only what sits under `settings/` needs it.
 */
export abstract class SettingsSheetComponent extends BaseComponent {
  private readonly opener: Locator;
  private readonly closer: Locator;

  protected constructor(page: Page) {
    super(page);

    this.opener = page.getByTestId("settings-open");
    this.closer = page.getByTestId("settings-close");
  }

  /** Opens the sheet, does something in it, and closes it again. */
  protected async inSheet(act: () => Promise<void>): Promise<void> {
    await this.opener.click();
    await act();
    await this.closer.click();
  }

  /** Opens the sheet and leaves it, for a control that closes the sheet itself when pressed. */
  protected async openSheet(): Promise<void> {
    await this.opener.click();
  }
}

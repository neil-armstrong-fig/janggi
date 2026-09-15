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
 * The sheet is divided into sections a player may fold away, and a folded section's controls are out
 * of sight too. So `inSheet` is handed the control it is about to press, unfolds the section holding it
 * if it has to, and folds it away again afterwards. Putting it back matters: the fixture turns the
 * effects down before every spec, and a sheet left with that section open would be a spec's starting
 * state that no player ever saw.
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

  /**
   * Opens the sheet, unfolds the section holding `control` if it is folded, does something in it, folds
   * that section away again if it was folded, and closes the sheet.
   */
  protected async inSheet(control: Locator, act: () => Promise<void>): Promise<void> {
    await this.withSheetOpen(async () => {
      const toggle = this.sectionHolding(control).getByTestId("settings-section-toggle");
      const wasFolded = (await toggle.getAttribute("aria-expanded")) === "false";

      if (wasFolded) await toggle.click();
      await act();
      if (wasFolded) await toggle.click();
    });
  }

  /**
   * Opens the sheet with `control` in sight and leaves it, for a control that closes the sheet itself.
   * Its section is left unfolded, there being no open sheet left to fold it in.
   */
  protected async openSheet(control: Locator): Promise<void> {
    await this.opener.click();

    const toggle = this.sectionHolding(control).getByTestId("settings-section-toggle");
    if ((await toggle.getAttribute("aria-expanded")) === "false") await toggle.click();
  }

  /** Opens the sheet, does something in it, and closes it again — for a press on the sheet's own parts. */
  protected async withSheetOpen(act: () => Promise<void>): Promise<void> {
    await this.opener.click();
    await act();
    await this.closer.click();
  }

  private sectionHolding(control: Locator): Locator {
    return this.page.getByTestId("settings-section").filter({has: control});
  }
}

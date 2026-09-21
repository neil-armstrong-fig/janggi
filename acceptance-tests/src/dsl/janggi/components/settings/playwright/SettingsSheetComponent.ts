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
 * A spec that wants to watch the board behind the sheet opens it itself, and then every action here
 * finds it open, acts, and **leaves it open** — closing what it did not open would shut the sheet
 * under the spec.
 *
 * The sheet is divided into tabs showing one pane at a time, and a hidden pane's controls are out of
 * reach. So `inSheet` is handed the control it is about to press, chooses the tab holding it if it is
 * not showing, and puts the tab the player was on back afterwards. Putting it back matters: the fixture
 * turns the effects down before every spec, and a sheet left on another tab would be a spec's starting
 * state that no player ever saw.
 *
 * A base class rather than a component another `*Playwright` holds, so each picker still owns only
 * its own locators and nothing becomes anybody's parent. Here rather than in `src/dsl/playwright/`
 * because only what sits under `settings/` needs it.
 */
export abstract class SettingsSheetComponent extends BaseComponent {
  private readonly opener: Locator;
  private readonly closer: Locator;
  protected readonly sheet: Locator;

  protected constructor(page: Page) {
    super(page);

    this.opener = page.getByTestId("settings-open");
    this.closer = page.getByTestId("settings-close");
    this.sheet = page.getByTestId("settings");
  }

  /**
   * Opens the sheet, chooses the tab holding `control` if it is not showing, does something in it,
   * puts the tab back, and closes the sheet if it was the one that opened it.
   */
  protected async inSheet(control: Locator, act: () => Promise<void>): Promise<void> {
    await this.withSheetOpen(async () => {
      const tab = await this.tabHolding(control);
      const leftOn = await this.selectedTabName();
      const needsSwitching = (await tab.getAttribute("aria-selected")) !== "true";

      if (needsSwitching) await tab.click();
      await act();
      if (needsSwitching) await this.tabNamed(leftOn).click();
    });
  }

  /**
   * Opens the sheet with `control` in sight and leaves it, for a control that closes the sheet itself.
   * Its tab is left showing, there being no open sheet left to put the old one back in.
   */
  protected async openSheet(control: Locator): Promise<void> {
    await this.openIfClosed();

    const tab = await this.tabHolding(control);
    if ((await tab.getAttribute("aria-selected")) !== "true") await tab.click();
  }

  /**
   * Opens the sheet, does something in it, and closes it again — for a press on the sheet's own parts.
   * A sheet that was already open is left open, since it is not this call's to close.
   */
  protected async withSheetOpen(act: () => Promise<void>): Promise<void> {
    const wasOpen = await this.isSheetOpen();

    if (!wasOpen) await this.opener.click();
    await act();
    if (!wasOpen) await this.closer.click();
  }

  protected async openIfClosed(): Promise<void> {
    if (!(await this.isSheetOpen())) await this.opener.click();
  }

  /** Read off `aria-modal`, which the sheet sets to whether it is open — the only attribute that says so. */
  protected async isSheetOpen(): Promise<boolean> {
    return (await this.sheet.getAttribute("aria-modal")) === "true";
  }

  protected tabNamed(name: string | null): Locator {
    return this.page.locator(`[data-testid='settings-tab'][data-tab='${name}']`);
  }

  private async tabHolding(control: Locator): Promise<Locator> {
    const pane = this.page.getByTestId("settings-pane").filter({has: control});

    return this.tabNamed(await pane.getAttribute("data-pane"));
  }

  private async selectedTabName(): Promise<string | null> {
    return await this.page.locator("[data-testid='settings-tab'][aria-selected='true']").getAttribute("data-tab");
  }
}

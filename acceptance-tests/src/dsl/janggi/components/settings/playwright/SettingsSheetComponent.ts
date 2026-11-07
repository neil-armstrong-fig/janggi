import {SettingsGroup} from "@src/dsl/janggi/components/settings/playwright/components/settings-group/SettingsGroup";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import type {SettingsTabName} from "@janggi/shared/janggi/settings/SettingsTabName";
import type {GroupAppearance} from "@src/dsl/janggi/components/settings/types/GroupAppearance";
import type {Locator, Page} from "@playwright/test";

/**
 * Base for controls that live in the settings sheet, including its navigation and folded groups.
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
 * Some tabs are folded into groups, one open at a time, and a folded group's controls are out of reach
 * too. So `inSheet` opens the group holding the control as well, and **puts back the group that was open**
 * afterwards, for the same reason as the tab: the fixture chooses the opponent before every spec, and a
 * tab left on the opponent's group would be a starting state no player opens the app to.
 *
 * Shared by settings adapters and reading-page launchers; it stores locators, never observed UI state.
 */
export abstract class SettingsSheetComponent extends BaseComponent {
  private readonly tabs: Record<SettingsTabName, Locator>;
  private readonly opener: Locator;
  private readonly closer: Locator;

  /** Subclasses query sheet bounds, backdrop styling and sheet-scoped controls. */
  protected readonly sheet: Locator;
  private readonly settingsGroup: Locator;
  private readonly settingsPane: Locator;
  private readonly selectedTab: Locator;

  protected constructor(page: Page) {
    super(page);
    this.tabs = {
      Play: page.locator("[data-testid='settings-tab'][data-tab='Play']"),
      Look: page.locator("[data-testid='settings-tab'][data-tab='Look']"),
      Sound: page.locator("[data-testid='settings-tab'][data-tab='Sound']"),
      You: page.locator("[data-testid='settings-tab'][data-tab='You']"),
    };

    this.opener = page.getByTestId("settings-open");
    this.closer = page.getByTestId("settings-close");
    this.sheet = page.getByTestId("settings");

    this.settingsGroup = this.page.getByTestId("settings-group");
    this.settingsPane = this.page.getByTestId("settings-pane");
    this.selectedTab = this.page.locator("[data-testid='settings-tab'][aria-selected='true']");
  }

  /**
   * Opens the sheet, chooses the tab holding `control` if it is not showing, does something in it,
   * puts the tab back, and closes the sheet if it was the one that opened it.
   */
  protected async inSheet<Answer>(control: Locator, act: () => Promise<Answer>): Promise<Answer> {
    return await this.withSheetOpen(async () => {
      const tab = await this.tabHolding(control);
      const leftOn = await this.selectedTabName();

      const needsSwitching = (await tab.getAttribute("aria-selected")) !== "true";
      if (needsSwitching) await tab.click();

      const putGroupBack = await this.openGroupHolding(control);
      const answer = await act();
      await putGroupBack();

      if (needsSwitching) await this.tabNamed(leftOn).click();

      return answer;
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
    await this.openGroupHolding(control);
  }

  /**
   * Opens the sheet, does something in it, and closes it again — for a press on the sheet's own parts.
   * A sheet that was already open is left open, since it is not this call's to close.
   */
  protected async withSheetOpen<Answer>(act: () => Promise<Answer>): Promise<Answer> {
    const wasOpen = await this.isSheetOpen();
    if (!wasOpen) await this.opener.click();

    const answer = await act();
    if (!wasOpen) await this.closer.click();

    return answer;
  }

  protected async openIfClosed(): Promise<void> {
    if (!(await this.isSheetOpen())) await this.opener.click();
  }

  /** Read off `aria-modal`, which the sheet sets to whether it is open — the only attribute that says so. */
  protected async isSheetOpen(): Promise<boolean> {
    return (await this.sheet.getAttribute("aria-modal")) === "true";
  }

  protected async readGroupAppearance(name: string): Promise<GroupAppearance> {
    return await this.groupNamed(name).evaluate(group => {
      const style = getComputedStyle(group);
      const contentId = group.querySelector("[aria-controls]")?.getAttribute("aria-controls");
      const content = contentId && document.getElementById(contentId);

      return {
        border: style.borderTopColor,
        background: style.backgroundColor,
        dividerWidth: parseFloat((content && getComputedStyle(content).borderTopWidth) || "0"),
      };
    });
  }

  protected groupNamed(name: string): Locator {
    return this.settingsGroup.and(this.page.locator(`[data-group="${name}"]`));
  }

  protected tabNamed(name: string): Locator {
    if (name === "Play" || name === "Look" || name === "Sound" || name === "You") return this.tabs[name];
    throw new Error(`Unknown settings tab: ${name}`);
  }

  private async tabHolding(control: Locator): Promise<Locator> {
    const pane = this.settingsPane.filter({has: control});
    const name = (await pane.getAttribute("data-pane")) ?? undefined;
    if (name === undefined) throw new Error("The settings pane names no tab");

    return this.tabNamed(name);
  }

  /**
   * Opens the folded group a control sits in, where it is out of sight only because its group is folded, and hands back
   * what puts the group that was open back. A control already on screen — a group's own line among them — is left
   * alone, so that line is never pressed twice.
   */
  private async openGroupHolding(control: Locator): Promise<() => Promise<void>> {
    const nothingToPutBack = async (): Promise<void> => {};
    if (await control.isVisible()) return nothingToPutBack;

    const group = this.settingsGroup.filter({has: control});
    if ((await group.count()) === 0) return nothingToPutBack;

    if ((await group.getAttribute("data-open")) === "true") return nothingToPutBack;

    const name = (await group.getAttribute("data-group")) ?? undefined;
    if (name === undefined) throw new Error("The settings group has no name");

    const paneName = await this.settingsPane.filter({has: control}).getAttribute("data-pane");
    const pane = this.settingsPane.and(this.page.locator(`[data-pane="${paneName}"]`));
    const opened = this.groupNamed(name);
    const openBefore = await this.openGroupName(pane);
    await group.getByTestId("settings-group-toggle").click();

    return async () => {
      await this.putGroupBack(opened, openBefore, pane);
    };
  }

  /** The group open on the tab showing, or nothing where every one is folded. */
  private async openGroupName(pane: Locator): Promise<string | undefined> {
    const open = pane.locator("[data-testid='settings-group'][data-open='true']");
    if ((await open.count()) === 0) return undefined;

    return (await open.getAttribute("data-group")) ?? undefined;
  }

  /**
   * Folds `opened` back by opening the group that was open before it, or by folding it where none was. Left alone where
   * what was done has already moved the groups on, as dealing a new game does.
   */
  private async putGroupBack(opened: Locator, openBefore: string | undefined, pane: Locator): Promise<void> {
    if ((await opened.getAttribute("data-open")) !== "true") return;

    if (openBefore === undefined) {
      await opened.getByTestId("settings-group-toggle").click();
    } else {
      await pane
        .locator(`[data-testid='settings-group'][data-group='${openBefore}']`)
        .getByTestId("settings-group-toggle")
        .click();
    }
  }

  private async selectedTabName(): Promise<string> {
    const name = (await this.selectedTab.getAttribute("data-tab")) ?? undefined;
    if (name === undefined) throw new Error("The selected settings tab has no name");

    return name;
  }
  protected async setGroupOpen(name: string, open: boolean): Promise<void> {
    await this.inSheet(this.groupNamed(name), async () => {
      await this.settingsGroupNamed(name).setOpen(open);
    });
  }

  protected settingsGroupNamed(name: string): SettingsGroup {
    return new SettingsGroup(this.groupNamed(name));
  }
}

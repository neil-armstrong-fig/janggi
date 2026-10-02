import type {Locator, Page} from "@playwright/test";
import {API_ORIGIN} from "@janggi/shared/janggi/account/ApiOrigin";
import {FakeApi} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/FakeApi";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";

/** How long a first visit may take to come back isolated, as `JanggiPlaywright.open` allows. */
const ISOLATION_TIMEOUT_MS = 15_000;

/**
 * The Account section of the settings sheet: signing in with Google, signing out, deleting the account, and whether
 * the player's data is being kept in step.
 *
 * It holds the `FakeApi` the app talks to instead of the real one. That is a server's state rather than the page's,
 * which is why a field here is allowed — see `FakeApi`.
 */
export class AccountSettingPlaywright extends SettingsSheetComponent {
  private api = new FakeApi();

  private readonly signIn: Locator;
  private readonly signedIn: Locator;
  private readonly signOut: Locator;
  private readonly deleteAccount: Locator;
  private readonly confirmDelete: Locator;
  private readonly name: Locator;
  private readonly nameInput: Locator;
  private readonly nameSave: Locator;
  private readonly nameMessage: Locator;
  private readonly syncState: Locator;

  constructor(page: Page) {
    super(page);

    this.signIn = page.getByTestId("account-sign-in");
    this.signedIn = page.getByTestId("account-signed-in");
    this.signOut = page.getByTestId("account-sign-out");
    this.deleteAccount = page.getByTestId("account-delete");
    this.confirmDelete = page.getByTestId("account-delete-confirm");
    this.name = page.getByTestId("account-name");
    this.nameInput = page.getByTestId("account-name-input");
    this.nameSave = page.getByTestId("account-name-save");
    this.nameMessage = page.getByTestId("account-name-message");
    this.syncState = page.getByTestId("account-sync-state");
  }

  /**
   * Answers every call to the API from here on, before the app has made one. Given another device's account section,
   * it answers from that device's server instead, so the two play against one account the way two phones would.
   */
  async standInForTheApi(sharedWith?: AccountSettingPlaywright): Promise<void> {
    if (sharedWith) this.api = sharedWith.api;

    await this.page.route(`${API_ORIGIN}/**`, route => this.api.answer(route, new URL(this.page.url()).origin, this));
  }

  async signInWithGoogle(): Promise<void> {
    await this.openSheet(this.signIn);
    await this.signIn.click();
    await this.signedIn.waitFor({state: "attached"});
  }

  async signOutOfGoogle(): Promise<void> {
    await this.inSheet(this.signOut, async () => {
      await this.signOut.click();
      await this.signIn.waitFor({state: "visible"});
    });
  }

  async deleteTheAccount(): Promise<void> {
    await this.inSheet(this.deleteAccount, async () => {
      await this.deleteAccount.click();
      await this.confirmDelete.click();
      await this.signIn.waitFor({state: "visible"});
    });
  }

  /**
   * Clears everything the device keeps and the Google session, and opens the app again, as a phone never used here.
   *
   * The app writes everything it holds as the page goes away, and the browser flushes a page's storage after it has
   * gone — so clearing from outside, and then leaving, loses a race with that last write, which puts back what was just
   * cleared. Clearing from inside the page, with writing switched off for what is left of it, cannot lose.
   */
  async moveToANewDevice(): Promise<void> {
    this.api.forgetTheSession(this);
    await this.page.evaluate(() => {
      Storage.prototype.setItem = () => undefined;
      localStorage.clear();
    });

    await this.page.reload();
    await this.page.waitForFunction(() => globalThis.crossOriginIsolated, undefined, {timeout: ISOLATION_TIMEOUT_MS});
  }

  /** Types a new display name into the box and saves it, waiting for the answer. */
  async renameTo(name: string): Promise<void> {
    await this.inSheet(this.nameInput, async () => {
      await this.nameInput.fill(name);
      await this.nameSave.click();
      await this.nameMessage.waitFor({state: "attached"});
    });
  }

  cutOffTheApi(): void {
    this.api.cutOff();
  }

  restoreTheApi(): void {
    this.api.restore();
  }

  getRequestsMadeToTheApi(): number {
    return this.api.getRequests().length;
  }

  /** Whether the settings have an account section at all, signed in or not. */
  async isAccountOffered(): Promise<boolean> {
    return (await this.page.getByTestId("account").count()) > 0;
  }

  async isSignInOffered(): Promise<boolean> {
    let offered = false;

    await this.inSheet(this.signIn, async () => {
      offered = await this.signIn.isVisible();
    });

    return offered;
  }

  /** Whether any sign-in control is drawn outside the settings sheet, where no player asked to see one. */
  async isSignInOfferedOutsideTheSettings(): Promise<boolean> {
    const everywhere = await this.page.getByTestId("account-sign-in").count();
    const inTheSheet = await this.sheet.getByTestId("account-sign-in").count();

    return everywhere > inTheSheet;
  }

  async isSignedIn(): Promise<boolean> {
    return (await this.signedIn.count()) > 0;
  }

  /** The display name shown for the account, or undefined where nobody is signed in. */
  async getName(): Promise<string | undefined> {
    return (await this.name.getAttribute("data-name")) ?? undefined;
  }

  /** Whether the last name tried was refused. */
  async isRenameRefused(): Promise<boolean> {
    return (await this.nameMessage.getAttribute("data-accepted")) === "false";
  }

  /** "synced" or "paused", or undefined where nobody is signed in and nothing is being kept. */
  async getSyncState(): Promise<string | undefined> {
    return (await this.syncState.getAttribute("data-state")) ?? undefined;
  }
}

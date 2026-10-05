import {TURN_NOTIFICATIONS_STATES} from "@janggi/shared/janggi/online/TurnNotificationsState";
import type {TurnNotificationsState} from "@janggi/shared/janggi/online/TurnNotificationsState";
import type {Locator, Page} from "@playwright/test";
import {API_ORIGIN} from "@janggi/shared/janggi/account/ApiOrigin";
import type {RoomAsked} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/fake-rooms/types/RoomAsked";
import {FakeApi} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/FakeApi";
import type {GooglePlayer} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/types/GooglePlayer";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";
import {ISOLATION_TIMEOUT_MS} from "@src/dsl/playwright/IsolationTimeout";

/**
 * The Account section of the settings sheet: signing in with Google, signing out, deleting the account, and whether
 * the player's data is being kept in step.
 *
 * It holds the `FakeApi` the app talks to instead of the real one. That is a server's state rather than the page's,
 * which is why a field here is allowed — see `FakeApi`.
 */
export class AccountSettingPlaywright extends SettingsSheetComponent {
  private api = new FakeApi();

  private readonly accountCard: Locator;
  private readonly signIn: Locator;
  private readonly signInFromPrompt: Locator;
  private readonly signedIn: Locator;
  private readonly signOut: Locator;
  private readonly deleteAccount: Locator;
  private readonly confirmDelete: Locator;
  private readonly name: Locator;
  private readonly nameInput: Locator;
  private readonly nameSave: Locator;
  private readonly nameMessage: Locator;
  private readonly syncState: Locator;
  private readonly replay: Locator;
  private readonly turnNotifications: Locator;

  constructor(page: Page) {
    super(page);

    this.accountCard = page.getByTestId("account");
    this.signIn = page.getByTestId("account-sign-in");
    this.signInFromPrompt = page.getByTestId("friend-sign-in-confirm");
    this.signedIn = page.getByTestId("account-signed-in");
    this.signOut = page.getByTestId("account-sign-out");
    this.deleteAccount = page.getByTestId("account-delete");
    this.confirmDelete = page.getByTestId("account-delete-confirm");
    this.name = page.getByTestId("account-name");
    this.nameInput = page.getByTestId("account-name-input");
    this.nameSave = page.getByTestId("account-name-save");
    this.nameMessage = page.getByTestId("account-name-message");
    this.syncState = page.getByTestId("account-sync-state");
    this.replay = page.getByTestId("tour-replay");
    this.turnNotifications = page.getByTestId("account-turn-notifications");
  }

  /**
   * Answers every call to the API from here on, before the app has made one. Given another device's account section,
   * it answers from that device's server instead, so the two play against one account the way two phones would.
   */
  async standInForTheApi(sharedWith?: AccountSettingPlaywright): Promise<void> {
    if (sharedWith) this.api = sharedWith.api;

    await this.page.route(`${API_ORIGIN}/**`, route => this.api.answer(route, new URL(this.page.url()).origin, this));
    await this.page.routeWebSocket(
      url => this.isARoomSocket(url),
      socket => this.api.acceptSocket(socket, this),
    );
  }

  /** A socket to one of the API's rooms: the API's own address, with `ws` in place of `http`, and a room's path. */
  private isARoomSocket(url: URL): boolean {
    return url.origin.replace(/^ws/, "http") === API_ORIGIN && url.pathname.startsWith("/api/rooms/");
  }

  /** From now on this device's connections to a friend's room are lost and refused, as in a tunnel. */
  dropTheFriendConnection(): void {
    this.api.dropRoomSockets(this);
  }

  getRoomsAsked(): readonly RoomAsked[] {
    return this.api.getRoomsAsked();
  }

  getDevicesToBeToldItsTheirTurn(): number {
    return this.api.getPushEndpointCount(this);
  }

  letGoOfTheRooms(): void {
    this.api.letGoOfRooms();
  }

  restoreTheFriendConnection(): void {
    this.api.restoreRoomSockets(this);
  }

  /** Taps the switch in the account card that says the player is to be told when it is their turn, and waits for it to be on. */
  async turnOnTurnNotifications(): Promise<void> {
    await this.inSheet(this.turnNotifications, async () => {
      await this.turnNotifications.getByRole("switch").click();
      await this.turnNotifications.and(this.page.locator('[data-state="on"]')).waitFor({state: "attached"});
    });
  }

  async turnOffTurnNotifications(): Promise<void> {
    await this.inSheet(this.turnNotifications, async () => {
      await this.turnNotifications.getByRole("switch").click();
      await this.turnNotifications.and(this.page.locator('[data-state="off"]')).waitFor({state: "attached"});
    });
  }

  /** Where this device stands on being told of the player's turns, once the page has found out; "unavailable" where the account card is not showing it (signed out). */
  async getTurnNotifications(): Promise<TurnNotificationsState> {
    let state: TurnNotificationsState = "unavailable";

    await this.withSheetOpen(async () => {
      await this.tabNamed("You").click();
      if ((await this.turnNotifications.count()) === 0) return;

      await this.turnNotifications.and(this.page.locator(':not([data-state="checking"])')).waitFor({state: "attached"});
      const found = await this.turnNotifications.getAttribute("data-state");

      state = TURN_NOTIFICATIONS_STATES.find(known => known === found) ?? "checking";
    });

    return state;
  }

  async signInWithGoogle(player?: GooglePlayer): Promise<void> {
    if (player !== undefined) this.api.signInNextAs(this, player);

    await this.openSheet(this.signIn);
    await this.signIn.click();
    await this.signedIn.waitFor({state: "attached"});
  }

  async signInFromThePrompt(player: GooglePlayer): Promise<void> {
    this.api.signInNextAs(this, player);

    await this.signInFromPrompt.click();
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

  /** The tour closes Settings itself because its first step points at the board. */
  async replayTheTour(): Promise<void> {
    await this.openIfClosed();
    await this.tabNamed("You").click();
    await this.replay.click();
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

  /** Whether the account card is picked out, as it is for a signed-out player sent to it by choosing Online. */
  async isAccountHighlighted(): Promise<boolean> {
    return (await this.accountCard.getAttribute("data-highlighted")) === "true";
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

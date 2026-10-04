import type {FriendCode} from "@janggi/shared/janggi/online/friend-code/FriendCode";
import {FRIEND_CONNECTION_STATUSES} from "@janggi/shared/janggi/online/FriendConnectionStatus";
import type {FriendConnectionStatus} from "@janggi/shared/janggi/online/FriendConnectionStatus";
import {FRIEND_GAME_STATES} from "@janggi/shared/janggi/online/FriendGameState";
import type {FriendGameState} from "@janggi/shared/janggi/online/FriendGameState";
import {JOIN_QUERY_PARAMETER} from "@janggi/shared/janggi/online/friend-code/JoinLink";
import type {Locator, Page} from "@playwright/test";
import {parseFriendCode} from "@janggi/shared/janggi/online/friend-code/ParseFriendCode";
import {ROOM_AWAY_DAYS} from "@janggi/shared/janggi/online/RoomAway";
import type {RoomAwayDays} from "@janggi/shared/janggi/online/RoomAway";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {SettingsSheetComponent} from "@src/dsl/janggi/components/settings/playwright/SettingsSheetComponent";
import {ISOLATION_TIMEOUT_MS} from "@src/dsl/playwright/IsolationTimeout";

/**
 * Playing a friend: the entry in the settings' Account tab, the sheet that makes or takes a code and has the two
 * choose their arrangements, and the strip over the board that says who the opponent is and how the game stands.
 *
 * The strip is in the page whenever a room is, even while the sheet covers it, so what it says is read the way a
 * closed settings sheet's is. The sheet and the strip are the app's; the room behind them is `FakeApi`'s.
 */
export class PlayAFriendPlaywright extends SettingsSheetComponent {
  private readonly open: Locator;
  private readonly friendSheet: Locator;
  private readonly sides: Record<Side, Locator>;
  private readonly awayChoices: Record<RoomAwayDays, Locator>;
  private readonly create: Locator;
  private readonly code: Locator;
  private readonly codeInput: Locator;
  private readonly join: Locator;
  private readonly joinMessage: Locator;
  private readonly signInPrompt: Locator;
  private readonly signInDismiss: Locator;
  private readonly setups: Record<SetupName, Locator>;
  private readonly status: Locator;
  private readonly connection: Locator;
  private readonly opponent: Locator;
  private readonly ownSide: Locator;
  private readonly turn: Locator;
  private readonly resignButton: Locator;
  private readonly leaveButton: Locator;
  private readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);

    this.open = page.getByTestId("play-a-friend-open");
    this.friendSheet = page.getByTestId("play-a-friend");
    this.sides = {han: page.getByTestId("friend-side-han"), cho: page.getByTestId("friend-side-cho")};
    this.awayChoices = Object.fromEntries(
      ROOM_AWAY_DAYS.map(days => [days, page.getByTestId(`friend-away-${days}`)]),
    ) as Record<RoomAwayDays, Locator>;
    this.create = page.getByTestId("friend-create");
    this.code = page.getByTestId("friend-code");
    this.codeInput = page.getByTestId("friend-code-input");
    this.join = page.getByTestId("friend-join");
    this.joinMessage = page.getByTestId("friend-join-message");
    this.signInPrompt = page.getByTestId("friend-sign-in");
    this.signInDismiss = page.getByTestId("friend-sign-in-dismiss");
    this.setups = {
      "Inner Elephant": page.getByTestId("friend-setup-inner-elephant"),
      "Outer Elephant": page.getByTestId("friend-setup-outer-elephant"),
      "Left Elephant": page.getByTestId("friend-setup-left-elephant"),
      "Right Elephant": page.getByTestId("friend-setup-right-elephant"),
      "Central Chariot": page.getByTestId("friend-setup-central-chariot"),
    };
    this.status = page.getByTestId("friend-status");
    this.connection = page.getByTestId("friend-connection");
    this.opponent = page.getByTestId("friend-opponent");
    this.ownSide = page.getByTestId("friend-own-side");
    this.turn = page.getByTestId("friend-strip");
    this.resignButton = page.getByTestId("friend-resign");
    this.leaveButton = page.getByTestId("friend-leave-game");
    this.closeButton = page.getByTestId("friend-close");
  }

  /**
   * Whether the settings' Account tab offers it. The tab is chosen by name rather than found by the control, because
   * where nobody is signed in the control is not there to be found.
   */
  async isOffered(): Promise<boolean> {
    let offered = false;

    await this.withSheetOpen(async () => {
      await this.tabNamed("Account").click();
      offered = await this.open.isVisible();
    });

    return offered;
  }

  /** Whether an entry to it is drawn anywhere but in the settings. */
  async isOfferedOutsideTheSettings(): Promise<boolean> {
    const everywhere = await this.page.getByTestId("play-a-friend-open").count();
    const inTheSettings = await this.page.getByTestId("settings").getByTestId("play-a-friend-open").count();

    return everywhere > inTheSettings;
  }

  /** Opens the sheet from the Account tab, which closes the settings behind it. */
  async openTheSheet(): Promise<void> {
    await this.openSheet(this.open);
    await this.open.click();
    await this.friendSheet.waitFor({state: "visible"});
  }

  /** Chooses how many days the room is kept once both are away. */
  async chooseHowLongToKeepTheRoom(days: RoomAwayDays): Promise<void> {
    await this.awayChoices[days].click();
  }

  /** How many days the sheet has chosen to keep the room for, before it is made. */
  async getHowLongToKeepTheRoom(): Promise<RoomAwayDays | undefined> {
    for (const days of ROOM_AWAY_DAYS) {
      if ((await this.awayChoices[days].getAttribute("aria-pressed")) === "true") {
        return days;
      }
    }

    return undefined;
  }

  async createACode(side: Side): Promise<void> {
    await this.sides[side].click();
    await this.create.click();
    await this.code.waitFor({state: "visible"});
  }

  async joinWithCode(text: string): Promise<void> {
    await this.codeInput.fill(text);
    await this.join.click();
  }

  /** Goes to the address a friend sent, as tapping the link would. */
  async openTheLink(code: FriendCode): Promise<void> {
    await this.page.goto(`./?${JOIN_QUERY_PARAMETER}=${code}`);
    await this.page.waitForFunction(() => globalThis.crossOriginIsolated, undefined, {timeout: ISOLATION_TIMEOUT_MS});
  }

  async isSignInPromptShown(): Promise<boolean> {
    return this.signInPrompt.isVisible();
  }

  async dismissTheSignInPrompt(): Promise<void> {
    await this.signInDismiss.click();
    await this.signInPrompt.waitFor({state: "hidden"});
  }

  /** Leaves a game that is over, still waiting for a friend, or whose friend is away, for the game the player had before it. */
  async leave(): Promise<void> {
    await this.leaveButton.click();
  }

  /** Closes the app and opens it again, as a player who put their phone away and came back to it. */
  async reopenTheApp(): Promise<void> {
    await this.page.reload();
    await this.page.waitForFunction(() => globalThis.crossOriginIsolated, undefined, {timeout: ISOLATION_TIMEOUT_MS});
  }

  async chooseSetup(name: SetupName): Promise<void> {
    await this.setups[name].click();
  }

  async resign(): Promise<void> {
    await this.resignButton.click();
  }

  /** The code the sheet shows the host, or undefined where it shows none. */
  async getCode(): Promise<FriendCode | undefined> {
    const text = await this.code.getAttribute("data-code");

    return text === null ? undefined : parseFriendCode(text);
  }

  /** The name the other player gave, or undefined where nobody is sat opposite yet. */
  async getOpponentName(): Promise<string | undefined> {
    return (await this.opponent.getAttribute("data-name")) ?? undefined;
  }

  /** Which army this player has been given, or undefined before the room has dealt them one. */
  async getOwnSide(): Promise<Side | undefined> {
    const side = await this.ownSide.getAttribute("data-side");

    return SIDES.find(known => known === side);
  }

  /** Whether the army's plaque wears the mark that says it is the one this player has. */
  async isMarkedAsYours(side: Side): Promise<boolean> {
    return (await this.page.getByTestId(`plaque-${side}`).getAttribute("data-own")) !== null;
  }

  /** Whether the strip tells this player it is their turn. False while it is the friend's, and where no game is being played. */
  async isYourTurn(): Promise<boolean> {
    return (await this.turn.getAttribute("data-your-turn")) === "true";
  }

  /** Where the game stands; "idle" where there is no room at all. */
  async getState(): Promise<FriendGameState> {
    // Where there is no room the strip is not drawn at all, and waiting for its attribute would only time out.
    if ((await this.status.count()) === 0) {
      return "idle";
    }

    const state = await this.status.getAttribute("data-state");

    return FRIEND_GAME_STATES.find(known => known === state) ?? "idle";
  }

  /** Closes the sheet, to the game and its strip beneath. */
  async closeTheSheet(): Promise<void> {
    await this.closeButton.click();
  }

  /** The words the strip shows for where the game stands, only if they are visible; empty where there is no room at all. */
  async getStatusWords(): Promise<string> {
    if ((await this.status.count()) === 0 || !(await this.status.isVisible())) {
      return "";
    }

    return (await this.status.innerText()).trim();
  }

  /** How this player's link to the room stands; "connecting" where there is no room at all. */
  async getConnection(): Promise<FriendConnectionStatus> {
    if ((await this.connection.count()) === 0) {
      return "connecting";
    }

    const connection = await this.connection.getAttribute("data-connection");

    return FRIEND_CONNECTION_STATUSES.find(known => known === connection) ?? "connecting";
  }

  /** Whether the last code tried was turned away — a code no room has, or one that is not a code. */
  async isJoinRefused(): Promise<boolean> {
    return (await this.joinMessage.getAttribute("data-refused")) === "true";
  }
}

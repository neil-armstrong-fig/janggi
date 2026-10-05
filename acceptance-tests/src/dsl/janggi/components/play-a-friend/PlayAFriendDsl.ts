import type {FriendConnectionStatus} from "@janggi/shared/janggi/online/FriendConnectionStatus";
import {DslError} from "@src/dsl/errors/DslError";
import type {FriendCode} from "@janggi/shared/janggi/online/friend-code/FriendCode";
import type {FriendGameState} from "@janggi/shared/janggi/online/FriendGameState";
import type {Page} from "@playwright/test";
import {PlayAFriendPlaywright} from "@src/dsl/janggi/components/play-a-friend/playwright/PlayAFriendPlaywright";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * Playing a friend by a friend code, reached as `janggi.playAFriend`: making a code or taking one, the two choosing their
 * arrangements, and what the game shows of the player opposite. The room behind it is stood in for with the API
 * (`janggi.settings.account.standInForTheApi`), so two devices in a spec meet in one room the way two phones would.
 */
export class PlayAFriendDsl {
  private readonly friend: PlayAFriendPlaywright;

  constructor(page: Page) {
    this.friend = new PlayAFriendPlaywright(page);
  }

  /** Whether playing a friend is offered anywhere but the settings — over the game, say. */
  async isOfferedOutsideTheSettings(): Promise<boolean> {
    try {
      return await this.friend.isOfferedOutsideTheSettings();
    } catch (error) {
      throw new DslError("Failed to read whether playing a friend is offered outside the settings", error);
    }
  }

  /** Opens the sheet to play a friend, from the Play tab of the settings. */
  async openPlayAFriend(): Promise<void> {
    try {
      await this.friend.openTheSheet();
    } catch (error) {
      throw new DslError("Failed to open playing a friend from the settings", error);
    }
  }

  /** Whether the sheet to play a friend is up. */
  async isTheSheetOpen(): Promise<boolean> {
    try {
      return await this.friend.isTheSheetOpen();
    } catch (error) {
      throw new DslError("Failed to read whether the sheet to play a friend is open", error);
    }
  }

  /** Goes back from the sheet to the Settings that opened it. */
  async goBackToSettings(): Promise<void> {
    try {
      await this.friend.goBackToSettings();
    } catch (error) {
      throw new DslError("Failed to go back from playing a friend to Settings", error);
    }
  }

  /** Makes a code to give a friend, playing `side`, and waits for it to be shown. */
  async createACode(side: Side): Promise<void> {
    try {
      await this.friend.createACode(side);
    } catch (error) {
      throw new DslError(`Failed to make a code to play ${side}`, error);
    }
  }

  /** Leaves a game that is over, or still waiting for a friend, for the game the player had before it. */
  async leave(): Promise<void> {
    try {
      await this.friend.leave();
    } catch (error) {
      throw new DslError("Failed to leave the game with a friend", error);
    }
  }

  /** Closes the app and opens it again, as a player who put their phone away and came back to it. */
  async reopenTheApp(): Promise<void> {
    try {
      await this.friend.reopenTheApp();
    } catch (error) {
      throw new DslError("Failed to close the app and open it again", error);
    }
  }

  /** From now on this browser lets the app ask to be allowed to notify, and says yes, as a phone with the app installed does. */
  async useABrowserThatCanBeNotified(): Promise<void> {
    try {
      await this.friend.standInForTheBrowser("accepts");
    } catch (error) {
      throw new DslError("Failed to make the browser one that can be sent notifications", error);
    }
  }

  /** From now on this browser has notifications blocked by its player, so the app may not ask. */
  async useABrowserThatBlocksNotifications(): Promise<void> {
    try {
      await this.friend.standInForTheBrowser("blocks");
    } catch (error) {
      throw new DslError("Failed to make the browser one that blocks notifications", error);
    }
  }

  /** From now on this browser has no push at all, as an iPhone's does until the app is on its Home Screen. */
  async useABrowserWithoutNotifications(): Promise<void> {
    try {
      await this.friend.standInForTheBrowser("has-none");
    } catch (error) {
      throw new DslError("Failed to make the browser one that has no notifications", error);
    }
  }

  /** Lets the app show notifications, as a player who said yes to the browser's question has. */
  async allowTheBrowserToShowNotifications(): Promise<void> {
    try {
      await this.friend.allowTheBrowserToShowNotifications();
    } catch (error) {
      throw new DslError("Failed to let the browser show notifications", error);
    }
  }

  /** The server tells this device that the friend `opponent` has moved, so it is the player's turn. */
  async receiveATurnPush(opponent: string): Promise<void> {
    try {
      await this.friend.receiveATurnPush(opponent);
    } catch (error) {
      throw new DslError(`Failed to deliver the server's push that ${opponent} has moved`, error);
    }
  }

  /** The server pushes this device something the app cannot read. */
  async receiveAnUnreadablePush(): Promise<void> {
    try {
      await this.friend.receiveAnUnreadablePush();
    } catch (error) {
      throw new DslError("Failed to deliver an unreadable push", error);
    }
  }

  /** What each notification the app is showing says, in the order the browser lists them. */
  async getNotificationsShown(): Promise<readonly string[]> {
    try {
      return await this.friend.getNotificationsShown();
    } catch (error) {
      throw new DslError("Failed to read the notifications being shown", error);
    }
  }

  /** Types what a friend gave — a code, as typed or pasted — and asks to join. */
  async joinWithCode(text: string): Promise<void> {
    try {
      await this.friend.joinWithCode(text);
    } catch (error) {
      throw new DslError(`Failed to join with the code "${text}"`, error);
    }
  }

  /** Opens the address a friend sent, which carries the code, as tapping it would. */
  async openTheLink(code: FriendCode): Promise<void> {
    try {
      await this.friend.openTheLink(code);
    } catch (error) {
      throw new DslError(`Failed to open the link for ${code}`, error);
    }
  }

  /** Whether the prompt that offers to sign a player in, for the friend's link they opened, is on screen. */
  async isSignInPromptShown(): Promise<boolean> {
    try {
      return await this.friend.isSignInPromptShown();
    } catch (error) {
      throw new DslError("Failed to read whether the sign-in prompt is shown", error);
    }
  }

  /** Turns the sign-in prompt down, and stays signed out. */
  async dismissTheSignInPrompt(): Promise<void> {
    try {
      await this.friend.dismissTheSignInPrompt();
    } catch (error) {
      throw new DslError("Failed to dismiss the sign-in prompt", error);
    }
  }

  /** Chooses this player's arrangement for the game, once both are sat down. */
  async chooseSetup(name: SetupName): Promise<void> {
    try {
      await this.friend.chooseSetup(name);
    } catch (error) {
      throw new DslError(`Failed to choose the ${name} setup`, error);
    }
  }

  async resign(): Promise<void> {
    try {
      await this.friend.resign();
    } catch (error) {
      throw new DslError("Failed to resign", error);
    }
  }

  /** The code the sheet shows the host, or undefined where it shows none. */
  async getCode(): Promise<FriendCode | undefined> {
    try {
      return await this.friend.getCode();
    } catch (error) {
      throw new DslError("Failed to read the friend code", error);
    }
  }

  /** The name the other player gave, or undefined where nobody is opposite yet. */
  async getOpponentName(): Promise<string | undefined> {
    try {
      return await this.friend.getOpponentName();
    } catch (error) {
      throw new DslError("Failed to read the opponent's name", error);
    }
  }

  /** Whether the army's plaque is marked as the one this player has. */
  async isMarkedAsYours(side: Side): Promise<boolean> {
    try {
      return await this.friend.isMarkedAsYours(side);
    } catch (error) {
      throw new DslError("Failed to read whether an army is marked as this player's", error);
    }
  }

  /** Whether the game with the friend tells this player it is their turn to move. */
  async isYourTurn(): Promise<boolean> {
    try {
      return await this.friend.isYourTurn();
    } catch (error) {
      throw new DslError("Failed to read whether it is this player's turn", error);
    }
  }

  /** The army this player was given, or undefined before the room has dealt it. */
  async getOwnSide(): Promise<Side | undefined> {
    try {
      return await this.friend.getOwnSide();
    } catch (error) {
      throw new DslError("Failed to read which army this player has", error);
    }
  }

  /** Where the game stands; "idle" where there is no room at all. */
  async getState(): Promise<FriendGameState> {
    try {
      return await this.friend.getState();
    } catch (error) {
      throw new DslError("Failed to read the state of the game against a friend", error);
    }
  }

  /** Closes the sheet, to the game and its strip beneath. */
  async closeTheSheet(): Promise<void> {
    try {
      await this.friend.closeTheSheet();
    } catch (error) {
      throw new DslError("Failed to close the sheet to play a friend", error);
    }
  }

  /** The words the strip shows for where the game stands, as a player reads them; empty where there is no room at all. */
  async getStatusWords(): Promise<string> {
    try {
      return await this.friend.getStatusWords();
    } catch (error) {
      throw new DslError("Failed to read the words of the game against a friend", error);
    }
  }

  /** How this player's link to the room stands: "connected", or "reconnecting" while it has dropped. */
  async getConnection(): Promise<FriendConnectionStatus> {
    try {
      return await this.friend.getConnection();
    } catch (error) {
      throw new DslError("Failed to read the state of the connection to the room", error);
    }
  }

  /** Whether the last code tried was turned away. */
  async isJoinRefused(): Promise<boolean> {
    try {
      return await this.friend.isJoinRefused();
    } catch (error) {
      throw new DslError("Failed to read whether the code was refused", error);
    }
  }
}

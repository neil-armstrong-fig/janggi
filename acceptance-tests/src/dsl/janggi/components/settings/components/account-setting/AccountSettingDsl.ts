import type {Page} from "@playwright/test";
import {AccountSettingPlaywright} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/AccountSettingPlaywright";
import {DslError} from "@src/dsl/errors/DslError";

/**
 * Signing in with Google and keeping a player's data in step across devices, reached as `janggi.settings.account`.
 *
 * Google and the API behind it are stood in for, never reached: `standInForTheApi` is said before the app opens,
 * and everything here talks to that stand-in. Signing in collapses Google's consent screen into the redirect back
 * to the site it ends in.
 */
export class AccountSettingDsl {
  private readonly account: AccountSettingPlaywright;

  constructor(page: Page) {
    this.account = new AccountSettingPlaywright(page);
  }

  /**
   * From now on the app's calls to the API are answered by a stand-in, so none reaches a real server. Given the other
   * device's account section, both are answered by the same server, as two phones would be.
   */
  async standInForTheApi(sharedWith?: AccountSettingDsl): Promise<void> {
    try {
      await this.account.standInForTheApi(sharedWith?.account);
    } catch (error) {
      throw new DslError("Failed to stand in for the API", error);
    }
  }

  /** Presses "Sign in with Google" in the settings, and waits for the app to come back signed in. */
  async signInWithGoogle(): Promise<void> {
    try {
      await this.account.signInWithGoogle();
    } catch (error) {
      throw new DslError("Failed to sign in with Google", error);
    }
  }

  async signOutOfGoogle(): Promise<void> {
    try {
      await this.account.signOutOfGoogle();
    } catch (error) {
      throw new DslError("Failed to sign out", error);
    }
  }

  async deleteTheAccount(): Promise<void> {
    try {
      await this.account.deleteTheAccount();
    } catch (error) {
      throw new DslError("Failed to delete the account", error);
    }
  }

  /** Clears everything the device keeps, and the Google session, and loads the app again, as a phone never used here. */
  async moveToANewDevice(): Promise<void> {
    try {
      await this.account.moveToANewDevice();
    } catch (error) {
      throw new DslError("Failed to move to a new device", error);
    }
  }

  /** Changes the account's display name from the settings, as a player typing a new one would. */
  async renameTo(name: string): Promise<void> {
    try {
      await this.account.renameTo(name);
    } catch (error) {
      throw new DslError(`Failed to change the display name to "${name}"`, error);
    }
  }

  /** From now on every call to the API fails, as when the free plan's daily cap is spent. */
  async cutOffTheApi(): Promise<void> {
    try {
      this.account.cutOffTheApi();
    } catch (error) {
      throw new DslError("Failed to cut off the API", error);
    }
  }

  async restoreTheApi(): Promise<void> {
    try {
      this.account.restoreTheApi();
    } catch (error) {
      throw new DslError("Failed to restore the API", error);
    }
  }

  /** How many calls the app has made to the API since it was opened, preflights included. */
  async getRequestsMadeToTheApi(): Promise<number> {
    try {
      return this.account.getRequestsMadeToTheApi();
    } catch (error) {
      throw new DslError("Failed to count the calls made to the API", error);
    }
  }

  /** Whether the settings have an account section at all. */
  async isAccountOffered(): Promise<boolean> {
    try {
      return await this.account.isAccountOffered();
    } catch (error) {
      throw new DslError("Failed to read whether the settings have an account section", error);
    }
  }

  /** Whether the settings offer to sign in. */
  async isSignInOffered(): Promise<boolean> {
    try {
      return await this.account.isSignInOffered();
    } catch (error) {
      throw new DslError("Failed to read whether signing in is offered in the settings", error);
    }
  }

  /** Whether a sign-in control is drawn anywhere but the settings — over the game, say. */
  async isSignInOfferedOutsideTheSettings(): Promise<boolean> {
    try {
      return await this.account.isSignInOfferedOutsideTheSettings();
    } catch (error) {
      throw new DslError("Failed to read whether signing in is offered outside the settings", error);
    }
  }

  async isSignedIn(): Promise<boolean> {
    try {
      return await this.account.isSignedIn();
    } catch (error) {
      throw new DslError("Failed to read whether the player is signed in", error);
    }
  }

  /** The display name the settings show for the account, or undefined where nobody is signed in. */
  async getName(): Promise<string | undefined> {
    try {
      return await this.account.getName();
    } catch (error) {
      throw new DslError("Failed to read the display name", error);
    }
  }

  /** Whether the last name tried was refused. */
  async isRenameRefused(): Promise<boolean> {
    try {
      return await this.account.isRenameRefused();
    } catch (error) {
      throw new DslError("Failed to read whether the name was refused", error);
    }
  }

  /** "synced" or "paused", or undefined where nobody is signed in. */
  async getSyncState(): Promise<string | undefined> {
    try {
      return await this.account.getSyncState();
    } catch (error) {
      throw new DslError("Failed to read the state of syncing", error);
    }
  }
}

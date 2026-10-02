import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * A signed-in player is known by a display name, never by their real one: the account is given one when it is made,
 * and the player can change it to whatever they like. The game never learns their name or email from Google, so a name
 * they give is only ever as real as they choose to make it.
 */
given("a player who has just signed in with Google for the first time", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.account.signInWithGoogle();
    await expect.poll(() => janggi.settings.account.getSyncState()).toBe("synced");
  });

  then("they have a name without having chosen one", async ({janggi}) => {
    expect(await janggi.settings.account.getName()).toBeTruthy();
  });

  when("they change it to one of their own", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.account.renameTo("Admiral Yi");
    });

    then("it is the name they are shown", async ({janggi}) => {
      expect(await janggi.settings.account.getName()).toBe("Admiral Yi");
    });

    when("they sign in again on a device they have never used", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.account.moveToANewDevice();
        await janggi.settings.account.signInWithGoogle();
      });

      then("the name is still theirs", async ({janggi}) => {
        await expect.poll(() => janggi.settings.account.getName()).toBe("Admiral Yi");
      });
    });
  });

  when("they try a name that is too long", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.account.renameTo("A name far longer than anyone could want");
    });

    then("it is refused", async ({janggi}) => {
      expect(await janggi.settings.account.isRenameRefused()).toBe(true);
    });

    then("they keep the name they had", async ({janggi}) => {
      expect(await janggi.settings.account.getName()).not.toBe("A name far longer than anyone could want");
    });
  });

  when("they try a name with nothing in it", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.account.renameTo("   ");
    });

    then("it is refused", async ({janggi}) => {
      expect(await janggi.settings.account.isRenameRefused()).toBe(true);
    });
  });
});

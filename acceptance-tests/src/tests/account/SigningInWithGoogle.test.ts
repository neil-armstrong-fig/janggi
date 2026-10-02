import {
  beforeEach,
  expect,
  given,
  then,
  useTheAccount,
  when,
} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {saveKeyWith} from "@src/shared/share-keys/SaveKeyWith";

/**
 * Signing in keeps a player's progress on a server, so it follows them to a device they have never played on.
 * The device stays the source of truth: the game plays the same signed out, and nothing is lost by signing out.
 */
given("a player who has earned some progress", () => {
  useTheAccount();

  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 640, beaten: {Casual: {cho: [800, 1000]}}}));
  });

  when("they sign in with Google from the settings, and it is kept in step", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.account.signInWithGoogle();
      await expect.poll(() => janggi.settings.account.getSyncState()).toBe("synced");
    });

    then("the settings show them signed in", async ({janggi}) => {
      expect(await janggi.settings.account.isSignedIn()).toBe(true);
    });

    when("they play on a device they have never used", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.account.moveToANewDevice();
      });

      then("nothing of their progress is there until they sign in", async ({janggi}) => {
        expect(await janggi.settings.progress.getXp()).toBe(0);
      });

      when("they sign in there", () => {
        beforeEach(async ({janggi}) => {
          await janggi.settings.account.signInWithGoogle();
        });

        then("their progress is restored", async ({janggi}) => {
          await expect.poll(() => janggi.settings.progress.getXp()).toBe(640);
        });
      });
    });

    when("they sign out", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.account.signOutOfGoogle();
      });

      then("signing in is offered again", async ({janggi}) => {
        expect(await janggi.settings.account.isSignInOffered()).toBe(true);
      });

      then("their progress stays on the device", async ({janggi}) => {
        expect(await janggi.settings.progress.getXp()).toBe(640);
      });
    });

    when("they delete their account", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.account.deleteTheAccount();
      });

      then("their progress stays on the device", async ({janggi}) => {
        expect(await janggi.settings.progress.getXp()).toBe(640);
      });

      when("they sign in on a device they have never used", () => {
        beforeEach(async ({janggi}) => {
          await janggi.settings.account.moveToANewDevice();
          await janggi.settings.account.signInWithGoogle();
        });

        then("nothing of theirs is left to restore", async ({janggi}) => {
          expect(await janggi.settings.progress.getXp()).toBe(0);
        });
      });
    });

    when("the API stops answering", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.account.cutOffTheApi();
        await janggi.settings.progress.loadSave(saveKeyWith({xp: 700}));
      });

      then("the settings say syncing is paused", async ({janggi}) => {
        await expect.poll(() => janggi.settings.account.getSyncState()).toBe("paused");
      });

      when("they carry on playing", () => {
        beforeEach(async ({janggi}) => {
          await janggi.board.tap(1, 7);
        });

        then("the game answers as it always did", async ({janggi}) => {
          expect(await janggi.board.isSelected(1, 7)).toBe(true);
        });
      });
    });
  });
});

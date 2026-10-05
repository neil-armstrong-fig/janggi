import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * A player who has put their phone away is told when their friend has moved: the app asks the browser for notifications
 * and gives the server the address to send them to. What the browser then shows, and what tapping it does, is the service worker's
 * (`pwa/BeingToldItsYourTurnInTheInstalledApp.test.ts`); the server's choice of whom to tell is tested where it is made. The
 * browser's own push service cannot be reached from a test, so the browser here is made to say what a real one would.
 */
given("a player who has not signed in, whose browser can be sent notifications", () => {
  beforeEach(async ({janggi}) => {
    await janggi.playAFriend.useABrowserThatCanBeNotified();
  });

  then("they are not offered them, as they mean nothing without an account", async ({janggi}) => {
    expect(await janggi.settings.account.getTurnNotifications()).toBe("unavailable");
  });
});

given("a signed-in player whose browser can be sent notifications", () => {
  beforeEach(async ({janggi}) => {
    await janggi.playAFriend.useABrowserThatCanBeNotified();
    await janggi.settings.account.signInWithGoogle();
  });

  then("they are offered to be told when it is their turn, which is off until they ask", async ({janggi}) => {
    expect(await janggi.settings.account.getTurnNotifications()).toBe("off");
    expect(await janggi.settings.account.getDevicesToBeToldItsTheirTurn()).toBe(0);
  });

  when("they turn notifications on", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.account.turnOnTurnNotifications();
    });

    then("it shows that they are on", async ({janggi}) => {
      expect(await janggi.settings.account.getTurnNotifications()).toBe("on");
    });

    then("the server has this device to tell", async ({janggi}) => {
      expect(await janggi.settings.account.getDevicesToBeToldItsTheirTurn()).toBe(1);
    });

    when("the app is opened again", () => {
      beforeEach(async ({janggi}) => {
        await janggi.playAFriend.reopenTheApp();
      });

      then("they are still on", async ({janggi}) => {
        await expect.poll(() => janggi.settings.account.getTurnNotifications()).toBe("on");
      });
    });

    when("they turn them off again", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.account.turnOffTurnNotifications();
      });

      then("it shows that they are off", async ({janggi}) => {
        expect(await janggi.settings.account.getTurnNotifications()).toBe("off");
      });

      then("the server has no device to tell", async ({janggi}) => {
        expect(await janggi.settings.account.getDevicesToBeToldItsTheirTurn()).toBe(0);
      });
    });

    when("they sign out", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.account.signOutOfGoogle();
      });

      then("the server no longer tells this device of their turns", async ({janggi}) => {
        expect(await janggi.settings.account.getDevicesToBeToldItsTheirTurn()).toBe(0);
      });
    });
  });
});

given("a signed-in player whose browser blocks notifications", () => {
  beforeEach(async ({janggi}) => {
    await janggi.playAFriend.useABrowserThatBlocksNotifications();
    await janggi.settings.account.signInWithGoogle();
  });

  then("they are told that the browser blocks them, and nothing is asked of the server", async ({janggi}) => {
    expect(await janggi.settings.account.getTurnNotifications()).toBe("blocked");
    expect(await janggi.settings.account.getDevicesToBeToldItsTheirTurn()).toBe(0);
  });
});

given("a signed-in player whose browser cannot be sent notifications at all", () => {
  beforeEach(async ({janggi}) => {
    await janggi.playAFriend.useABrowserWithoutNotifications();
    await janggi.settings.account.signInWithGoogle();
  });

  then("they are not offered them", async ({janggi}) => {
    expect(await janggi.settings.account.getTurnNotifications()).toBe("unavailable");
  });
});

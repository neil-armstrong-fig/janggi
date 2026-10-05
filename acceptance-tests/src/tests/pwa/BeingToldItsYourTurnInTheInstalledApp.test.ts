import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * What the installed app shows when the server pushes to it that a friend has moved. The push is delivered to the real service
 * worker, which is why this runs against a compiled build; whether the server sends one at all, and to whom, is decided and tested
 * in the API. Tapping the notification is the worker's too, and is covered where its decision is made (`ShowTheApp.test.ts`).
 */
given("a player whose browser lets the app show notifications", () => {
  beforeEach(async ({janggi}) => {
    await janggi.playAFriend.allowTheBrowserToShowNotifications();
  });

  when("the server pushes that their friend has moved", () => {
    beforeEach(async ({janggi}) => {
      await janggi.playAFriend.receiveATurnPush("Yi Sun-sin");
    });

    then("a notification names the friend and says it is their turn", async ({janggi}) => {
      await expect
        .poll(() => janggi.playAFriend.getNotificationsShown())
        .toEqual(["Yi Sun-sin has moved. It's your turn."]);
    });

    when("another friend's move is pushed before the player has looked", () => {
      beforeEach(async ({janggi}) => {
        await expect.poll(() => janggi.playAFriend.getNotificationsShown()).toHaveLength(1);
        await janggi.playAFriend.receiveATurnPush("Kim Yu-sin");
        await expect
          .poll(() => janggi.playAFriend.getNotificationsShown())
          .toContain("Kim Yu-sin has moved. It's your turn.");
      });

      then("the newer notification has replaced the older, not stacked on it", async ({janggi}) => {
        expect(await janggi.playAFriend.getNotificationsShown()).toEqual(["Kim Yu-sin has moved. It's your turn."]);
      });
    });
  });

  when("the server pushes something the app cannot read", () => {
    beforeEach(async ({janggi}) => {
      await janggi.playAFriend.receiveAnUnreadablePush();
    });

    then("a notification still says it is their turn, since a push must always be shown", async ({janggi}) => {
      await expect.poll(() => janggi.playAFriend.getNotificationsShown()).toEqual(["It's your turn."]);
    });
  });
});

given("a player who reads the game in Korean, whose browser lets the app show notifications", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.language.setTo("ko");
    await janggi.playAFriend.allowTheBrowserToShowNotifications();
  });

  when("the server pushes that their friend has moved", () => {
    beforeEach(async ({janggi}) => {
      await janggi.playAFriend.receiveATurnPush("Yi Sun-sin");
    });

    then("the notification is in Korean", async ({janggi}) => {
      await expect
        .poll(() => janggi.playAFriend.getNotificationsShown())
        .toEqual(["Yi Sun-sin님이 수를 두었습니다. 당신의 차례입니다."]);
    });
  });

  when("the server pushes something the app cannot read", () => {
    beforeEach(async ({janggi}) => {
      await janggi.playAFriend.receiveAnUnreadablePush();
    });

    then("the notification still says it is their turn, in Korean", async ({janggi}) => {
      await expect.poll(() => janggi.playAFriend.getNotificationsShown()).toEqual(["당신의 차례입니다."]);
    });
  });
});

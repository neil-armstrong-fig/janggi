import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("a player follows a settings link into another sheet", () => {
  when("they go back from their styles", () => {
    beforeEach(async ({janggi}) => {
      await janggi.stylesSheet.openStyles();
      await janggi.stylesSheet.goBackToSettings();
    });

    then("they return to the Look settings that opened it", async ({janggi}) => {
      expect(await janggi.settings.isOpen()).toBe(true);
      expect(await janggi.settings.isTabSelected("Look")).toBe(true);
    });
  });

  when("they go back from playing a friend", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.account.signInWithGoogle();
      await janggi.playAFriend.openPlayAFriend();
      await janggi.playAFriend.goBackToSettings();
    });

    then("they return to the Play settings that opened it", async ({janggi}) => {
      expect(await janggi.settings.isOpen()).toBe(true);
      expect(await janggi.settings.isTabSelected("Play")).toBe(true);
    });
  });

  when("they go back from their record", () => {
    beforeEach(async ({janggi}) => {
      await janggi.recordSheet.openRecord();
      await janggi.recordSheet.goBackToSettings();
    });

    then("they return to the Play settings that opened it", async ({janggi}) => {
      expect(await janggi.settings.isOpen()).toBe(true);
      expect(await janggi.settings.isTabSelected("Play")).toBe(true);
    });
  });
});

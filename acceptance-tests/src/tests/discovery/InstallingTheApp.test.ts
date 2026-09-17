import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("a player opens the web game on a phone", () => {
  beforeEach(async ({janggi}) => {
    await janggi.resizeWindowTo(390, 844);
  });

  when("the browser offers to install Janggi", () => {
    beforeEach(async ({janggi}) => {
      await janggi.offerInstallation();
    });

    then("Settings offers to install the app", async ({janggi}) => {
      expect(await janggi.settings.install.isShown()).toBe(true);
    });

    when("they choose to install it from Settings", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.install.choose();
      });

      then("the browser's installation process starts", async ({janggi}) => {
        expect(await janggi.wasInstallationPrompted()).toBe(true);
      });
    });
  });

  when("the browser does not offer installation", () => {
    then("Settings has no installation action", async ({janggi}) => {
      expect(await janggi.settings.install.isShown()).toBe(false);
    });
  });
});

given("a player opens the web game on a wider screen", () => {
  beforeEach(async ({janggi}) => {
    await janggi.resizeWindowTo(1024, 900);
    await janggi.offerInstallation();
  });

  when("they view Settings", () => {
    then("the phone installation action stays out of the way", async ({janggi}) => {
      expect(await janggi.settings.install.isShown()).toBe(false);
    });
  });
});

import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("a player has opened Janggi before", () => {
  when("they open it again without a network connection", () => {
    beforeEach(async ({janggi}) => {
      await janggi.reloadOffline();
    });

    then("the game is ready to play", async ({janggi}) => {
      expect(await janggi.board.isVisible()).toBe(true);
    });
  });
});

given("a player adds Janggi to their home screen", () => {
  when("their device reads the installation details", () => {
    then("it is given sharp, adaptive launcher artwork", async ({janggi}) => {
      expect(await janggi.getInstallationAppearance()).toEqual({
        name: "Janggi",
        display: "standalone",
        icons: [
          {width: 192, height: 192, purpose: "any"},
          {width: 512, height: 512, purpose: "any"},
          {width: 512, height: 512, purpose: "maskable"},
        ],
        appleTouchIcon: {width: 180, height: 180, purpose: "any"},
      });
    });
  });
});

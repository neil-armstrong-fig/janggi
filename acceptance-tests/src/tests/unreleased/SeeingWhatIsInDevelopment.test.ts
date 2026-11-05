import {expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("a build with the unreleased work in it", () => {
  when("the Play tab is looked at", () => {
    then("it lists what is in development", async ({janggi}) => {
      expect(await janggi.settings.getFeaturesInDevelopment()).toEqual(["Clocks", "Matchmaking", "Variants"]);
    });
  });
});

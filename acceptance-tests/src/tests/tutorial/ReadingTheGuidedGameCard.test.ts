import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("a player following the guided game", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.you.startTheTutorial();
  });

  when("a piece is spotlighted", () => {
    then("the instruction card is above the layer dimming the board", async ({janggi}) => {
      await expect.poll(() => janggi.tutorial.isAboveTheDimmingLayer()).toBe(true);
    });
  });
});

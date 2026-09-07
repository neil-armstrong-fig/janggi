import {expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("a user opens the game for the first time", () => {
  when("the page has loaded", () => {
    then("the board is visible", async ({board}) => {
      const visible = await board.isVisible();

      expect(visible).toBe(true);
    });
  });
});

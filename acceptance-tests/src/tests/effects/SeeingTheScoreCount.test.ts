import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * A score counts down to what an army is now worth rather than jumping there. What is asserted is
 * where the count comes to rest, because a count that stopped short is the thing that would go wrong.
 * Run only by the `*-effects` projects.
 */
given("motion is left on", () => {
  when("han takes one of cho's soldiers", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
      await janggi.board.tap(1, 4);
      await janggi.board.tap(1, 5);
      await janggi.board.tap(3, 7);
      await janggi.board.tap(3, 6);
      await janggi.board.tap(1, 5);
      await janggi.board.tap(1, 6);
    });

    then("cho's score is shown coming to rest on the seventy points cho is now worth", async ({janggi}) => {
      expect(await janggi.status.getShownScore("cho")).toBe(70);
    });

    then("han's score is shown unchanged", async ({janggi}) => {
      expect(await janggi.status.getShownScore("han")).toBe(73.5);
    });
  });
});

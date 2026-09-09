import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * What each army is worth, which is what a game settles on when it stops without a checkmate. The
 * board already says which pieces are gone; the score says what their going cost.
 */
given("a game has just begun", () => {
  when("nothing has been taken", () => {
    then("both armies are worth the seventy-two points they were dealt, and han its 덤", async ({janggi}) => {
      expect(await janggi.status.getScore("cho")).toBe(72);
      expect(await janggi.status.getScore("han")).toBe(73.5);
    });
  });
});

given("the two soldiers on file 1 have advanced into contact", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(1, 7);
    await janggi.board.tap(1, 6);
    await janggi.board.tap(1, 4);
    await janggi.board.tap(1, 5);
    await janggi.board.tap(3, 7);
    await janggi.board.tap(3, 6);
  });

  when("han takes cho's soldier", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 5);
      await janggi.board.tap(1, 6);
    });

    then("cho is down the two points a soldier is worth, and han is untouched", async ({janggi}) => {
      expect(await janggi.status.getScore("cho")).toBe(70);
      expect(await janggi.status.getScore("han")).toBe(73.5);
    });
  });
});

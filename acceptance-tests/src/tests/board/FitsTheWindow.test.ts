import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * The board is centred in whatever space the controls leave it, so a board that does not fit
 * overflows evenly and its top edge goes off screen where nothing can scroll to it. These shapes
 * are the ones that catch that: a window far wider than it is tall has plenty of room across and
 * almost none down, which is the case a board sized only by its width gets wrong.
 */
given("a user has the game open", () => {
  when("the window is short and wide", () => {
    beforeEach(async ({janggi}) => {
      await janggi.resizeWindowTo(1400, 420);
    });

    then("the whole board is still on screen", async ({janggi}) => {
      expect(await janggi.board.isFullyOnScreen()).toBe(true);
    });
  });

  when("the window is tall and narrow", () => {
    beforeEach(async ({janggi}) => {
      await janggi.resizeWindowTo(420, 1200);
    });

    then("the whole board is still on screen", async ({janggi}) => {
      expect(await janggi.board.isFullyOnScreen()).toBe(true);
    });
  });

  when("the window is barely bigger than the controls", () => {
    beforeEach(async ({janggi}) => {
      await janggi.resizeWindowTo(360, 300);
    });

    then("the whole board is still on screen", async ({janggi}) => {
      expect(await janggi.board.isFullyOnScreen()).toBe(true);
    });
  });
});

given("a user opens the game for the first time", () => {
  when("the page has loaded", () => {
    then("the whole board is on screen", async ({janggi}) => {
      expect(await janggi.board.isFullyOnScreen()).toBe(true);
    });
  });
});

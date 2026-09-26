import {
  beforeEach,
  expect,
  given,
  then,
  useFreshPlayer,
  when,
} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/** Skipping is always on offer and never punished: the welcome is not shown again, on this device. */
given("a player at the welcome", () => {
  useFreshPlayer();

  when("they skip it from the introduction", () => {
    beforeEach(async ({janggi}) => {
      await janggi.onboarding.skipTheWelcome();
    });

    then("the welcome is gone, and no tour comes in its place", async ({janggi}) => {
      expect(await janggi.onboarding.isWelcomeShown()).toBe(false);
      expect(await janggi.onboarding.isTourShown()).toBe(false);
    });

    then("the game is left on the board, untouched", async ({janggi}) => {
      expect(await janggi.board.getPieceCount()).toBe(32);
    });

    when("the game is opened again", () => {
      beforeEach(async ({janggi}) => {
        await janggi.reload();
      });

      then("neither the welcome nor the tour is shown again", async ({janggi}) => {
        expect(await janggi.onboarding.isWelcomeShown()).toBe(false);
        expect(await janggi.onboarding.isTourShown()).toBe(false);
      });
    });
  });

  when("they skip it from the choices", () => {
    beforeEach(async ({janggi}) => {
      await janggi.onboarding.continueTheWelcome();
      await janggi.onboarding.skipTheWelcome();
    });

    then("the welcome is gone, and no tour comes in its place", async ({janggi}) => {
      expect(await janggi.onboarding.isWelcomeShown()).toBe(false);
      expect(await janggi.onboarding.isTourShown()).toBe(false);
    });
  });

  when("they press Escape", () => {
    beforeEach(async ({janggi}) => {
      await janggi.onboarding.pressEscape();
    });

    then("the welcome is gone, and no tour comes in its place", async ({janggi}) => {
      expect(await janggi.onboarding.isWelcomeShown()).toBe(false);
      expect(await janggi.onboarding.isTourShown()).toBe(false);
    });
  });
});

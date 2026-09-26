import {
  beforeEach,
  expect,
  given,
  then,
  useFreshPlayer,
  when,
} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const STEPS_IN_THE_TOUR = 7;

/**
 * The tour that follows the welcome, over the real page. What each step points at and teaches has a spec
 * of its own; this is the card that carries them — where it begins, how it moves, how it ends, and that
 * it is never a wall.
 */
given("a player who has started the tour from the welcome", () => {
  useFreshPlayer();

  beforeEach(async ({janggi}) => {
    await janggi.onboarding.continueTheWelcome();
    await janggi.onboarding.startTheTour();
  });

  when("the tour begins", () => {
    then("the welcome makes way for it", async ({janggi}) => {
      expect(await janggi.onboarding.isWelcomeShown()).toBe(false);
      expect(await janggi.onboarding.isTourShown()).toBe(true);
    });

    then("it says it is the first of its steps", async ({janggi}) => {
      expect(await janggi.onboarding.getTourStep()).toBe(1);
      expect(await janggi.onboarding.getTourStepCount()).toBe(STEPS_IN_THE_TOUR);
    });

    then("there is nowhere to go back to", async ({janggi}) => {
      expect(await janggi.onboarding.canGoBackInTheTour()).toBe(false);
    });
  });

  when("they go on", () => {
    beforeEach(async ({janggi}) => {
      await janggi.onboarding.nextTourStep();
    });

    then("it is the second step", async ({janggi}) => {
      expect(await janggi.onboarding.getTourStep()).toBe(2);
    });

    then("they can go back", async ({janggi}) => {
      expect(await janggi.onboarding.canGoBackInTheTour()).toBe(true);
    });

    when("they go back again", () => {
      beforeEach(async ({janggi}) => {
        await janggi.onboarding.previousTourStep();
      });

      then("it is the first step again", async ({janggi}) => {
        expect(await janggi.onboarding.getTourStep()).toBe(1);
      });
    });
  });

  when("they reach the last step", () => {
    beforeEach(async ({janggi}) => {
      for (let step = 1; step < STEPS_IN_THE_TOUR; step++) {
        await janggi.onboarding.nextTourStep();
      }
    });

    then("it offers to finish", async ({janggi}) => {
      expect(await janggi.onboarding.getTourStep()).toBe(STEPS_IN_THE_TOUR);
      expect(await janggi.onboarding.isFinishOffered()).toBe(true);
    });

    when("they finish", () => {
      beforeEach(async ({janggi}) => {
        await janggi.onboarding.finishTheTour();
      });

      then("the tour is gone", async ({janggi}) => {
        expect(await janggi.onboarding.isTourShown()).toBe(false);
      });

      when("the game is opened again", () => {
        beforeEach(async ({janggi}) => {
          await janggi.reload();
        });

        then("the tour is not shown again", async ({janggi}) => {
          expect(await janggi.onboarding.isTourShown()).toBe(false);
          expect(await janggi.onboarding.isWelcomeShown()).toBe(false);
        });
      });
    });
  });

  when("they skip it part of the way through", () => {
    beforeEach(async ({janggi}) => {
      await janggi.onboarding.nextTourStep();
      await janggi.onboarding.skipTheTour();
    });

    then("the tour is gone", async ({janggi}) => {
      expect(await janggi.onboarding.isTourShown()).toBe(false);
    });

    when("the game is opened again", () => {
      beforeEach(async ({janggi}) => {
        await janggi.reload();
      });

      then("the tour is not shown again", async ({janggi}) => {
        expect(await janggi.onboarding.isTourShown()).toBe(false);
        expect(await janggi.onboarding.isWelcomeShown()).toBe(false);
      });
    });
  });

  when("they press Escape part of the way through", () => {
    beforeEach(async ({janggi}) => {
      await janggi.onboarding.nextTourStep();
      await janggi.onboarding.pressEscape();
    });

    then("the tour is gone", async ({janggi}) => {
      expect(await janggi.onboarding.isTourShown()).toBe(false);
    });

    when("the game is opened again", () => {
      beforeEach(async ({janggi}) => {
        await janggi.reload();
      });

      then("the tour is not shown again", async ({janggi}) => {
        expect(await janggi.onboarding.isTourShown()).toBe(false);
      });
    });
  });

  when("the game is closed and opened again part of the way through", () => {
    beforeEach(async ({janggi}) => {
      await janggi.onboarding.nextTourStep();
      await janggi.onboarding.nextTourStep();
      await janggi.reload();
    });

    then("the tour is on the step it was left on", async ({janggi}) => {
      expect(await janggi.onboarding.isTourShown()).toBe(true);
      expect(await janggi.onboarding.getTourStep()).toBe(3);
    });
  });
});

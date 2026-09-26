import {
  beforeEach,
  expect,
  given,
  then,
  useFreshPlayer,
  when,
} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * What each step of the tour points at, and what a player does to move it on. The first two steps are
 * taught by doing — the player picks up a piece and moves it, for real, against the bot they were given —
 * and the rest are read and continued. `TakingTheTour.test.ts` is the card that carries them.
 */
given("a player who is on the tour's first step", () => {
  useFreshPlayer();

  beforeEach(async ({janggi}) => {
    await janggi.onboarding.continueTheWelcome();
    await janggi.onboarding.startTheTour();
    await janggi.status.waitForTheBotToLoad();
  });

  when("the step is shown", () => {
    then("it points at one of their own pieces", async ({janggi}) => {
      const point = await janggi.onboarding.getSpotlightedPoint();

      expect(await janggi.onboarding.getTourSpotlightTarget()).toBe("point");
      expect((await janggi.board.getPieceAt(point.file, point.rank))?.side).toBe("cho");
    });
  });

  when("they pick up the piece it points at", () => {
    beforeEach(async ({janggi}) => {
      const point = await janggi.onboarding.getSpotlightedPoint();

      await janggi.board.tap(point.file, point.rank);
    });

    then("the tour goes on to the second step by itself", async ({janggi}) => {
      expect(await janggi.onboarding.getTourStep()).toBe(2);
    });

    then("it points at a place the piece can go", async ({janggi}) => {
      const point = await janggi.onboarding.getSpotlightedPoint();

      expect(await janggi.board.canMoveTo(point.file, point.rank)).toBe(true);
    });

    when("they move it there", () => {
      beforeEach(async ({janggi}) => {
        const point = await janggi.onboarding.getSpotlightedPoint();

        await janggi.board.tap(point.file, point.rank);
      });

      then("the tour goes on to the third step by itself", async ({janggi}) => {
        expect(await janggi.onboarding.getTourStep()).toBe(3);
      });

      then("it points at the controls", async ({janggi}) => {
        expect(await janggi.onboarding.getTourSpotlightTarget()).toBe("controls");
      });
    });
  });

  when("they go on without picking anything up", () => {
    beforeEach(async ({janggi}) => {
      await janggi.onboarding.nextTourStep();
    });

    then("the second step still has a piece to point at", async ({janggi}) => {
      expect(await janggi.onboarding.getTourSpotlightTarget()).toBe("point");
      const point = await janggi.onboarding.getSpotlightedPoint();

      expect((await janggi.board.getPieceAt(point.file, point.rank))?.side).toBe("cho");
    });
  });
});

given("a player who is on the tour's fourth step, which is about Settings", () => {
  useFreshPlayer();

  beforeEach(async ({janggi}) => {
    await janggi.onboarding.continueTheWelcome();
    await janggi.onboarding.startTheTour();
    await janggi.onboarding.nextTourStep();
    await janggi.onboarding.nextTourStep();
    await janggi.onboarding.nextTourStep();
  });

  when("the step is shown", () => {
    then("it points at the settings button, with the settings still closed", async ({janggi}) => {
      expect(await janggi.onboarding.getTourStep()).toBe(4);
      expect(await janggi.onboarding.getTourSpotlightTarget()).toBe("settings");
      expect(await janggi.settings.isOpen()).toBe(false);
    });
  });

  when("they open the settings", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.openTheSettings();
    });

    then("the tour goes on to the fifth step by itself", async ({janggi}) => {
      expect(await janggi.onboarding.getTourStep()).toBe(5);
    });

    then("it shows them their progress, on the tab that keeps it", async ({janggi}) => {
      expect(await janggi.settings.isOpen()).toBe(true);
      expect(await janggi.settings.isTabSelected("Progress")).toBe(true);
      expect(await janggi.onboarding.getTourSpotlightTarget()).toBe("xp");
    });

    when("they go on", () => {
      beforeEach(async ({janggi}) => {
        await janggi.onboarding.nextTourStep();
      });

      then("the settings stay open on the tab that holds their styles", async ({janggi}) => {
        expect(await janggi.settings.isOpen()).toBe(true);
        expect(await janggi.settings.isTabSelected("Look")).toBe(true);
        expect(await janggi.onboarding.getTourSpotlightTarget()).toBe("styles");
      });

      then("it says what it costs to make their own, from the price the game charges", async ({janggi}) => {
        expect(await janggi.onboarding.getTourText()).toContain("300 XP");
      });
    });

    when("the game is closed and opened again", () => {
      beforeEach(async ({janggi}) => {
        await janggi.reload();
      });

      then("the tour comes back to the same step with the settings open for it", async ({janggi}) => {
        expect(await janggi.onboarding.getTourStep()).toBe(5);
        expect(await janggi.settings.isOpen()).toBe(true);
        expect(await janggi.settings.isTabSelected("Progress")).toBe(true);
      });
    });

    when("they go back to the step about Settings", () => {
      beforeEach(async ({janggi}) => {
        await janggi.onboarding.previousTourStep();
      });

      then("the settings are closed again, to be opened", async ({janggi}) => {
        expect(await janggi.settings.isOpen()).toBe(false);
        expect(await janggi.onboarding.getTourSpotlightTarget()).toBe("settings");
      });
    });
  });
});

given("a player who is on the tour's last step", () => {
  useFreshPlayer();

  beforeEach(async ({janggi}) => {
    await janggi.onboarding.continueTheWelcome();
    await janggi.onboarding.startTheTour();
    await janggi.onboarding.nextTourStep();
    await janggi.onboarding.nextTourStep();
    await janggi.onboarding.nextTourStep();
    await janggi.settings.openTheSettings();
    await janggi.onboarding.nextTourStep();
    await janggi.onboarding.nextTourStep();
  });

  when("the step is shown", () => {
    then("the settings have been put away", async ({janggi}) => {
      expect(await janggi.onboarding.getTourStep()).toBe(7);
      expect(await janggi.settings.isOpen()).toBe(false);
    });

    then("it sends them to the guide, in a new tab", async ({janggi}) => {
      expect(await janggi.onboarding.isTourGuideLinkForTheGuide()).toBe(true);
    });

    when("they go back", () => {
      beforeEach(async ({janggi}) => {
        await janggi.onboarding.previousTourStep();
      });

      then("the settings are opened again, on the tab that holds their styles", async ({janggi}) => {
        expect(await janggi.settings.isOpen()).toBe(true);
        expect(await janggi.settings.isTabSelected("Look")).toBe(true);
      });
    });
  });
});

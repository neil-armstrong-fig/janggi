import {
  beforeEach,
  expect,
  given,
  then,
  useFreshPlayer,
  when,
} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("a first-time player who makes the tour’s demonstration move", () => {
  useFreshPlayer();

  beforeEach(async ({janggi}) => {
    await janggi.onboarding.continueTheWelcome();
    await janggi.onboarding.startTheTour();
    const piece = await janggi.onboarding.getSpotlightedPoint();
    await janggi.board.tap(piece.file, piece.rank);
    const destination = await janggi.onboarding.getSpotlightedPoint();
    await janggi.board.tap(destination.file, destination.rank);
  });

  when("they skip the rest of the tour", () => {
    beforeEach(async ({janggi}) => {
      await janggi.onboarding.skipTheTour();
    });

    then("they are on a fresh board, ready for a guided game", async ({janggi}) => {
      expect(await janggi.status.getTurn()).toBe("cho");
      expect(await janggi.board.getPieceAt(1, 7)).toEqual({side: "cho", type: "soldier"});
      expect(await janggi.settings.you.canStartTheTutorial()).toBe(true);
    });
  });
});

given("a returning player with a move already played", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(1, 7);
    await janggi.board.tap(1, 6);
  });

  when("they replay the tour", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.you.account.replayTheTour();
    });

    then("the demonstration starts on its own fresh board", async ({janggi}) => {
      expect(await janggi.board.getPieceAt(1, 7)).toEqual({side: "cho", type: "soldier"});
      expect(await janggi.board.getPieceAt(1, 6)).toBeUndefined();
    });

    when("they skip the demonstration", () => {
      beforeEach(async ({janggi}) => {
        await janggi.onboarding.skipTheTour();
      });

      then("their own position is restored", async ({janggi}) => {
        expect(await janggi.board.getPieceAt(1, 6)).toEqual({side: "cho", type: "soldier"});
        expect(await janggi.status.getTurn()).toBe("han");
      });
    });
  });
});

given("a player looking for the guided game in Play", () => {
  when("they read its shortcut", () => {
    then("it uses the guided-game name", async ({janggi}) => {
      await expect.poll(() => janggi.settings.play.getGuidedGameLabel()).toBe("Guided game");
    });
  });

  when("they press the shortcut", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.play.startTheGuidedGame();
    });

    then("the guided game starts", async ({janggi}) => {
      expect(await janggi.tutorial.isShown()).toBe(true);
    });
  });
});

given("a first-time player at the last tour card", () => {
  useFreshPlayer();

  beforeEach(async ({janggi}) => {
    await janggi.onboarding.continueTheWelcome();
    await janggi.onboarding.startTheTour();
    const piece = await janggi.onboarding.getSpotlightedPoint();
    await janggi.board.tap(piece.file, piece.rank);
    const destination = await janggi.onboarding.getSpotlightedPoint();
    await janggi.board.tap(destination.file, destination.rank);
    for (let step = 3; step < 8; step++) await janggi.onboarding.nextTourStep();
  });

  when("they choose the guided game", () => {
    beforeEach(async ({janggi}) => {
      await janggi.onboarding.startTheGuidedGame();
    });

    then("the tour gives way to the guided game", async ({janggi}) => {
      expect(await janggi.onboarding.isTourShown()).toBe(false);
      expect(await janggi.tutorial.isShown()).toBe(true);
    });

    when("they leave the guided game", () => {
      beforeEach(async ({janggi}) => {
        await janggi.tutorial.leave();
      });

      then("their own fresh board is restored", async ({janggi}) => {
        expect(await janggi.status.getTurn()).toBe("cho");
      });
    });
  });
});

given("the help links in You", () => {
  when("they are read together", () => {
    then("learning and reference links are separate sections", async ({janggi}) => {
      expect(await janggi.settings.you.isHelpGrouped()).toBe(true);
    });
  });
});

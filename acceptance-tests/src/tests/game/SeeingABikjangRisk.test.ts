import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * 빅장 is called by the player it is handed to, so a move that leaves the generals facing hands the
 * opponent that call. A piece in hand says which of its moves would do it — softly, with 빅장 written
 * on the dot a move already has, since a bikjang is often exactly what a player wants. See
 * `docs/rules.md` §6.2.
 *
 * It is two moves from the opening: once cho's soldier has stepped off file 5, han's soldier on
 * (5,4) is the one piece left between the generals. Stepping sideways opens the file; stepping
 * forward stays on it.
 */
given("cho's soldier has stepped off file 5, leaving han's the only piece between the generals", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(5, 7);
    await janggi.board.tap(4, 7);
  });

  when("the game is being played casually and han picks up that soldier", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(5, 4);
    });

    then("each sideways step is marked as a bikjang risk", async ({janggi}) => {
      expect(await janggi.board.isMarkedAsBikjangRisk(4, 4)).toBe(true);
      expect(await janggi.board.isMarkedAsBikjangRisk(6, 4)).toBe(true);
    });

    then("the step forward, which keeps the file blocked, is a move but not a risk", async ({janggi}) => {
      expect(await janggi.board.canMoveTo(5, 5)).toBe(true);
      expect(await janggi.board.isMarkedAsBikjangRisk(5, 5)).toBe(false);
    });

    when("han puts the soldier down again", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(5, 6);
      });

      then("nothing is marked any more", async ({janggi}) => {
        expect(await janggi.board.isMarkedAsBikjangRisk(4, 4)).toBe(false);
        expect(await janggi.board.isMarkedAsBikjangRisk(6, 4)).toBe(false);
      });
    });
  });

  when("han picks up a soldier that has nothing to do with file 5", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 4);
    });

    then("none of its moves is marked as a bikjang risk", async ({janggi}) => {
      expect(await janggi.board.canMoveTo(1, 5)).toBe(true);
      expect(await janggi.board.isMarkedAsBikjangRisk(1, 5)).toBe(false);
    });
  });
});

given("a scored game in which cho's soldier has stepped off file 5", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.matchFormat.setTo("Scored");
    // A scored game is laid out before it is played — han first, then cho. Until both have, the
    // board answers nothing, and the criteria below would pass for the wrong reason.
    await janggi.settings.hanSetup.setTo("Inner Elephant");
    await janggi.settings.choSetup.setTo("Inner Elephant");
    await janggi.board.tap(5, 7);
    await janggi.board.tap(4, 7);
  });

  when("han picks up the soldier between the generals with both armies still whole", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(5, 4);
    });

    then("its sideways steps are moves but not risks, since no bikjang could be called", async ({janggi}) => {
      expect(await janggi.board.canMoveTo(4, 4)).toBe(true);
      expect(await janggi.board.isMarkedAsBikjangRisk(4, 4)).toBe(false);
      expect(await janggi.board.isMarkedAsBikjangRisk(6, 4)).toBe(false);
    });
  });
});

given("a game that has just been dealt", () => {
  when("nothing has been chosen about the bikjang hint", () => {
    then("the hint is shown", async ({janggi}) => {
      expect(await janggi.settings.bikjangHint.getSelected()).toBe("Shown");
    });
  });
});

given("the bikjang hint is hidden, and cho's soldier has stepped off file 5", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.bikjangHint.setTo("Hidden");
    await janggi.board.tap(5, 7);
    await janggi.board.tap(4, 7);
  });

  when("han picks up the soldier between the generals", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(5, 4);
    });

    then("the sideways steps are moves but carry no label", async ({janggi}) => {
      expect(await janggi.board.canMoveTo(4, 4)).toBe(true);
      expect(await janggi.board.isMarkedAsBikjangRisk(4, 4)).toBe(false);
      expect(await janggi.board.isMarkedAsBikjangRisk(6, 4)).toBe(false);
    });

    when("the hint is shown again", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.bikjangHint.setTo("Shown");
      });

      then("the same steps are labelled, the choice being worn the moment it is made", async ({janggi}) => {
        expect(await janggi.board.isMarkedAsBikjangRisk(4, 4)).toBe(true);
        expect(await janggi.board.isMarkedAsBikjangRisk(6, 4)).toBe(true);
      });
    });
  });
});

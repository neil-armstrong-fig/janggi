import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Beside each army, the pieces it has lost. The score says what the losses cost; this says what they
 * were, which is the question a player actually asks when a chariot goes missing from the far side
 * of the board.
 */
given("a game has just begun", () => {
  when("nothing has been taken", () => {
    then("neither army is shown to have lost anything", async ({janggi}) => {
      expect(await janggi.status.getTakenFrom("cho")).toEqual([]);
      expect(await janggi.status.getTakenFrom("han")).toEqual([]);
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

    then("cho is shown to have lost a soldier", async ({janggi}) => {
      expect(await janggi.status.getTakenFrom("cho")).toEqual(["soldier"]);
    });

    then("han is shown to have lost nothing", async ({janggi}) => {
      expect(await janggi.status.getTakenFrom("han")).toEqual([]);
    });

    when("the capture is taken back", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.undo();
      });

      then("cho is shown to have lost nothing again", async ({janggi}) => {
        expect(await janggi.status.getTakenFrom("cho")).toEqual([]);
      });
    });
  });
});

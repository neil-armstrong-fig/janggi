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

    then("the soldier stands in the place kept for soldiers, whichever army has lost one", async ({janggi}) => {
      expect(await janggi.status.getTakenSlotOffset("cho", "soldier")).toBe(
        await janggi.status.getTakenSlotOffset("han", "soldier"),
      );
    });

    when("han takes a second of cho's soldiers", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(3, 6);
        await janggi.board.tap(2, 6);
        await janggi.board.tap(1, 6);
        await janggi.board.tap(2, 6);
      });

      then("cho is shown to have lost two soldiers", async ({janggi}) => {
        expect(await janggi.status.getTakenFrom("cho")).toEqual(["soldier", "soldier"]);
      });

      then("the two are one soldier with a count of two", async ({janggi}) => {
        expect(await janggi.status.getTakenCount("cho", "soldier")).toBe(2);
      });
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

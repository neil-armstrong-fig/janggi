import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * The herald says a general is in check; the board says which one, and what is attacking it. A player
 * glancing at the board should not have to trace every file and diagonal to find the piece giving
 * check — least of all a cannon's, which reaches over a screen.
 *
 * Marks rather than motion, so they are shown however much the board is allowed to move. The check
 * itself is the one `WinningAGame.test.ts` plays: cho's chariot lands on (4,9) with han's general
 * walked out onto file 4.
 */
given("a game is being played", () => {
  when("nobody is under attack", () => {
    then("neither general is marked as under attack", async ({janggi}) => {
      expect(await janggi.board.isMarkedAsUnderAttack(5, 2)).toBe(false);
      expect(await janggi.board.isMarkedAsUnderAttack(5, 9)).toBe(false);
    });
  });

  when("cho puts han's general under attack", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 10);
      await janggi.board.tap(1, 9);

      await janggi.board.tap(5, 2);
      await janggi.board.tap(4, 2);

      await janggi.board.tap(1, 9);
      await janggi.board.tap(4, 9);
    });

    then("han's general is marked as under attack", async ({janggi}) => {
      expect(await janggi.board.isMarkedAsUnderAttack(4, 2)).toBe(true);
    });

    then("the chariot giving check is marked as the attacker", async ({janggi}) => {
      expect(await janggi.board.isMarkedAsAttacking(4, 9)).toBe(true);
    });

    then("cho's own general is not marked", async ({janggi}) => {
      expect(await janggi.board.isMarkedAsUnderAttack(5, 9)).toBe(false);
    });

    when("han steps the general off the file", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(4, 2);
        await janggi.board.tap(5, 2);
      });

      then("nothing is marked any more", async ({janggi}) => {
        expect(await janggi.board.isMarkedAsUnderAttack(5, 2)).toBe(false);
        expect(await janggi.board.isMarkedAsAttacking(4, 9)).toBe(false);
      });
    });
  });
});

import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * 한수쉼 — resting the turn rather than playing something. It is why janggi has no stalemate, and
 * two rested in a row stop the game and settle it on points, which from the opening position hands
 * it to han on the 1.5 덤 alone. Both of those are reachable by tapping, unlike a checkmate.
 */
given("a game has just begun", () => {
  when("nobody has played anything yet", () => {
    then("cho may rest the turn", async ({janggi}) => {
      expect(await janggi.status.canPass()).toBe(true);
    });
  });

  when("cho rests the turn", () => {
    beforeEach(async ({janggi}) => {
      await janggi.status.pass();
    });

    then("it is han to move", async ({janggi}) => {
      expect(await janggi.status.getTurn()).toBe("han");
    });

    then("nothing has left the board, a rested turn moving nothing", async ({janggi}) => {
      expect(await janggi.board.getPieceCount()).toBe(32);
    });

    then("nobody has won, one rested turn being only one player's agreement", async ({janggi}) => {
      expect(await janggi.status.getWinner()).toBeUndefined();
    });

    when("han rests the turn as well", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.pass();
      });

      then("the game is over, won by han on the 덤 alone", async ({janggi}) => {
        expect(await janggi.status.getWinner()).toBe("han");
      });

      then("neither army may rest another turn", async ({janggi}) => {
        expect(await janggi.status.canPass()).toBe(false);
      });

      when("a player reaches for a piece anyway", () => {
        beforeEach(async ({janggi}) => {
          await janggi.board.tap(1, 7);
        });

        then("nothing is picked up and nothing is offered", async ({janggi}) => {
          expect(await janggi.board.isSelected(1, 7)).toBe(false);
          expect(await janggi.board.canMoveTo(1, 6)).toBe(false);
        });
      });
    });

    when("han sweeps a soldier instead, and cho then rests a second turn", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(1, 4);
        await janggi.board.tap(1, 5);

        await janggi.status.pass();
      });

      then("nobody has won, the move between having cleared the count", async ({janggi}) => {
        expect(await janggi.status.getWinner()).toBeUndefined();
      });
    });
  });
});

given("han's general is under attack", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(1, 10);
    await janggi.board.tap(1, 9);

    await janggi.board.tap(5, 2);
    await janggi.board.tap(4, 2);

    await janggi.board.tap(1, 9);
    await janggi.board.tap(4, 9);
  });

  when("han would rather rest the turn than answer it", () => {
    then("han may not, a check having to be answered", async ({janggi}) => {
      expect(await janggi.status.canPass()).toBe(false);
    });
  });
});

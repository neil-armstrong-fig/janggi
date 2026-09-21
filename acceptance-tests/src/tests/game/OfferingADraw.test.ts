import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * A draw offered and accepted — 합의 무승부, which friendly janggi allows where a tournament does not.
 * See `docs/rules.md` §6.4.
 *
 * Only the offering itself is played here. What ends a looping endgame by itself, and whether the bot
 * accepts, both begin under thirty points a side, which is far deeper than anyone can tap — those are
 * covered by unit tests on the engine and the bot. Against a person the offer needs no such depth, so
 * it is played from the opening position.
 */
given("a casual game between two people has just begun", () => {
  when("cho, to move, offers a draw", () => {
    beforeEach(async ({janggi}) => {
      await janggi.status.offerDraw();
    });

    then("han is asked whether to accept, the offer being cho's", async ({janggi}) => {
      expect(await janggi.status.getDrawOfferedBy()).toBe("cho");
    });

    then("nobody has won and the game is not drawn yet", async ({janggi}) => {
      expect(await janggi.status.getWinner()).toBeUndefined();
      expect(await janggi.status.isDrawn()).toBe(false);
    });

    when("han accepts", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.acceptDraw();
      });

      then("the game is drawn by agreement", async ({janggi}) => {
        expect(await janggi.status.getDrawnBy()).toBe("agreement");
      });

      then("nobody has won it, a draw having no winner", async ({janggi}) => {
        expect(await janggi.status.getWinner()).toBeUndefined();
      });

      then("nothing has left the board, an agreement moving nothing", async ({janggi}) => {
        expect(await janggi.board.getPieceCount()).toBe(32);
      });

      then("the question is gone and no further offer can be made", async ({janggi}) => {
        expect(await janggi.status.getDrawOfferedBy()).toBeUndefined();
        expect(await janggi.status.canOfferDraw()).toBe(false);
      });

      when("the agreement is taken back", () => {
        beforeEach(async ({janggi}) => {
          await janggi.status.undo();
        });

        then("the game is being played again, with cho to move", async ({janggi}) => {
          expect(await janggi.status.isDrawn()).toBe(false);
          expect(await janggi.status.getTurn()).toBe("cho");
        });
      });
    });

    when("han declines", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.declineDraw();
      });

      then("the question is gone and the game carries on", async ({janggi}) => {
        expect(await janggi.status.getDrawOfferedBy()).toBeUndefined();
        expect(await janggi.status.isDrawn()).toBe(false);
        expect(await janggi.status.getTurn()).toBe("cho");
      });

      then("a note over the board says han declined", async ({janggi}) => {
        expect(await janggi.status.getDrawDeclinedBy()).toBe("han");
      });
    });

    when("cho plays a move instead of waiting for an answer", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(1, 7);
        await janggi.board.tap(1, 6);
      });

      then("the offer has lapsed, and it is han's turn", async ({janggi}) => {
        expect(await janggi.status.getDrawOfferedBy()).toBeUndefined();
        expect(await janggi.status.getTurn()).toBe("han");
      });
    });
  });
});

/**
 * The scored format has no draw — 대한장기연맹 abolished it in 2020 — and two players who wish to
 * stop already have two rested turns in a row, which count the points. So there is nothing to offer.
 */
given("a scored game is being played", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.matchFormat.setTo("Scored");
    await janggi.settings.hanSetup.setTo("Inner Elephant");
    await janggi.settings.choSetup.setTo("Inner Elephant");
  });

  when("cho looks for a way to offer a draw", () => {
    then("there is none to press", async ({janggi}) => {
      expect(await janggi.status.canOfferDraw()).toBe(false);
    });
  });
});

import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * 빅장 — the two generals coming to face each other down an open file, which either player may then
 * call. See `docs/rules.md` §6.2.
 *
 * It is two moves from the opening position, which makes it the one endgame rule that can be played
 * out by tapping: file 5 holds nothing but the two generals and a soldier each, and a soldier moves
 * sideways from the very first move. Both formats are reachable the same way, so the setting is
 * covered by playing it rather than by asserting on the picker alone.
 */
given("the two soldiers on file 5 have stepped aside, leaving the generals facing", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(5, 7);
    await janggi.board.tap(4, 7);
    await janggi.board.tap(5, 4);
    await janggi.board.tap(4, 4);
  });

  when("the game is being played casually", () => {
    then("cho may call the bikjang", async ({janggi}) => {
      expect(await janggi.status.canCallBikjang()).toBe(true);
    });

    then("nobody has won and the game is not drawn yet", async ({janggi}) => {
      expect(await janggi.status.getWinner()).toBeUndefined();
      expect(await janggi.status.isDrawn()).toBe(false);
    });

    when("cho calls it", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.callBikjang();
      });

      then("the game is drawn", async ({janggi}) => {
        expect(await janggi.status.isDrawn()).toBe(true);
      });

      then("nobody has won it, a draw having no winner", async ({janggi}) => {
        expect(await janggi.status.getWinner()).toBeUndefined();
      });

      then("nothing has left the board, a call moving nothing", async ({janggi}) => {
        expect(await janggi.board.getPieceCount()).toBe(32);
      });

      then("neither army may rest a turn or call again", async ({janggi}) => {
        expect(await janggi.status.canPass()).toBe(false);
        expect(await janggi.status.canCallBikjang()).toBe(false);
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

      when("the call is taken back", () => {
        beforeEach(async ({janggi}) => {
          await janggi.status.undo();
        });

        then("the game is being played again", async ({janggi}) => {
          expect(await janggi.status.isDrawn()).toBe(false);
          expect(await janggi.status.getTurn()).toBe("cho");
        });

        then("the bikjang is still there to be called", async ({janggi}) => {
          expect(await janggi.status.canCallBikjang()).toBe(true);
        });
      });
    });

    when("cho steps its general aside instead", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(5, 9);
        await janggi.board.tap(4, 9);
      });

      then("there is no longer a bikjang to call", async ({janggi}) => {
        expect(await janggi.status.canCallBikjang()).toBe(false);
      });
    });
  });
});

/**
 * The KJA's scored format gates the call on each side holding under thirty points — a rule of the
 * 점수제 tournament game rather than of janggi, which is what reconciles it with the English
 * sources. Two whole armies are seventy-two points each, so the same position that is a draw for the
 * asking in a casual game cannot be called at all here.
 */
given("a scored game has reached the same position", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.matchFormat.setTo("Scored");
    await janggi.board.tap(5, 7);
    await janggi.board.tap(4, 7);
    await janggi.board.tap(5, 4);
    await janggi.board.tap(4, 4);
  });

  when("both armies are still whole", () => {
    then("the generals are facing, and the call is refused all the same", async ({janggi}) => {
      expect(await janggi.status.canCallBikjang()).toBe(false);
    });

    then("the game carries on", async ({janggi}) => {
      expect(await janggi.status.getTurn()).toBe("cho");
      expect(await janggi.status.isDrawn()).toBe(false);
    });
  });
});

/** The format is a rule of the match, so it is settled before play the way a back rank is. */
given("a game is about to start", () => {
  when("nothing has been played yet", () => {
    then("the format is casual, which is the game played online", async ({janggi}) => {
      expect(await janggi.settings.matchFormat.getSelected()).toBe("Casual");
    });

    then("the format may still be chosen", async ({janggi}) => {
      expect(await janggi.settings.matchFormat.isChoosable()).toBe(true);
    });
  });

  when("the format is changed", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.matchFormat.setTo("Scored");
    });

    then("the scored game is the one being played", async ({janggi}) => {
      expect(await janggi.settings.matchFormat.getSelected()).toBe("Scored");
    });

    then("the board is dealt afresh, a format being no more changeable mid-game than a back rank", async ({janggi}) => {
      expect(await janggi.board.getPieceCount()).toBe(32);
      expect(await janggi.status.getTurn()).toBe("cho");
    });
  });

  when("cho has played a move", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
    });

    then("the format may no longer be chosen", async ({janggi}) => {
      expect(await janggi.settings.matchFormat.isChoosable()).toBe(false);
    });

    when("the move is taken back", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.undo();
      });

      then("the format may be chosen again", async ({janggi}) => {
        expect(await janggi.settings.matchFormat.isChoosable()).toBe(true);
      });
    });
  });
});

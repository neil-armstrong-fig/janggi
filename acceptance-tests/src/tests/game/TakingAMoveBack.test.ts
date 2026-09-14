import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Taking a turn back and playing it again. Not a rule of janggi — no source has anything to say
 * about it — but the one thing a player on a phone reaches for hardest, having no opponent to ask.
 *
 * A rested turn is taken back exactly as a move is, and so is the turn that ended the game, which is
 * the case the controls exist for and the one every other control refuses.
 */
given("a game has just begun", () => {
  when("nobody has played anything yet", () => {
    then("there is nothing to take back", async ({janggi}) => {
      expect(await janggi.status.canUndo()).toBe(false);
    });

    then("there is nothing to play again", async ({janggi}) => {
      expect(await janggi.status.canRedo()).toBe(false);
    });
  });

  when("cho sweeps its edge soldier", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
    });

    then("the move can be taken back", async ({janggi}) => {
      expect(await janggi.status.canUndo()).toBe(true);
    });

    then("there is still nothing to play again", async ({janggi}) => {
      expect(await janggi.status.canRedo()).toBe(false);
    });

    when("the move is taken back", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.undo();
      });

      then("the soldier stands where it started", async ({janggi}) => {
        expect(await janggi.board.getPieceAt(1, 7)).toEqual({side: "cho", type: "soldier"});
        expect(await janggi.board.getPieceAt(1, 6)).toBeUndefined();
      });

      then("it is cho to move again", async ({janggi}) => {
        expect(await janggi.status.getTurn()).toBe("cho");
      });

      then("there is nothing left to take back", async ({janggi}) => {
        expect(await janggi.status.canUndo()).toBe(false);
      });

      then("the move is waiting to be played again", async ({janggi}) => {
        expect(await janggi.status.canRedo()).toBe(true);
      });

      then("the board is playable again, and not frozen at the position it was taken back from", async ({janggi}) => {
        expect(await janggi.board.canBeMoved(1, 7)).toBe(true);
      });

      when("the move is played again", () => {
        beforeEach(async ({janggi}) => {
          await janggi.status.redo();
        });

        then("the soldier stands where it was played to", async ({janggi}) => {
          expect(await janggi.board.getPieceAt(1, 6)).toEqual({side: "cho", type: "soldier"});
        });

        then("it is han to move", async ({janggi}) => {
          expect(await janggi.status.getTurn()).toBe("han");
        });

        then("there is nothing left to play again", async ({janggi}) => {
          expect(await janggi.status.canRedo()).toBe(false);
        });
      });

      when("cho sweeps the other edge soldier instead", () => {
        beforeEach(async ({janggi}) => {
          await janggi.board.tap(9, 7);
          await janggi.board.tap(9, 6);
        });

        then("the move that was taken back is forgotten", async ({janggi}) => {
          expect(await janggi.status.canRedo()).toBe(false);
        });

        then("the move actually played is the one on the board", async ({janggi}) => {
          expect(await janggi.board.getPieceAt(9, 6)).toEqual({side: "cho", type: "soldier"});
          expect(await janggi.board.getPieceAt(1, 6)).toBeUndefined();
        });
      });
    });
  });

  when("cho rests the turn", () => {
    beforeEach(async ({janggi}) => {
      await janggi.status.pass();
    });

    when("the rested turn is taken back", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.undo();
      });

      then("it is cho to move again", async ({janggi}) => {
        expect(await janggi.status.getTurn()).toBe("cho");
      });

      then("nothing has left the board, a rested turn having moved nothing either way", async ({janggi}) => {
        expect(await janggi.board.getPieceCount()).toBe(32);
      });
    });
  });
});

/**
 * A back rank is arranged strictly before play, so the pickers lock once a turn has been taken.
 * Taking that turn back puts the game back before play, and they have to open again — otherwise the
 * board is at its starting position with the arrangement that produced it out of reach.
 */
given("cho has played the opening move", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(1, 7);
    await janggi.board.tap(1, 6);
  });

  when("play has begun", () => {
    then("neither setup may be chosen", async ({janggi}) => {
      expect(await janggi.settings.canChooseSetups()).toBe(false);
    });
  });

  when("the opening move is taken back", () => {
    beforeEach(async ({janggi}) => {
      await janggi.status.undo();
    });

    then("both setups may be chosen again, the game being back before play", async ({janggi}) => {
      expect(await janggi.settings.canChooseSetups()).toBe(true);
    });
  });
});

/**
 * The whole reason undo is not gated the way passing and moving are. Both of those refuse once the
 * game is decided; taking back the turn that decided it is exactly what a player wants next.
 */
given("both players have rested a turn and the game is settled on points", () => {
  beforeEach(async ({janggi}) => {
    await janggi.status.pass();
    await janggi.status.pass();
  });

  when("the game has been won", () => {
    then("han has won on the 덤 alone", async ({janggi}) => {
      expect(await janggi.status.getWinner()).toBe("han");
    });

    then("the result can still be taken back", async ({janggi}) => {
      expect(await janggi.status.canUndo()).toBe(true);
    });
  });

  when("the result is taken back", () => {
    beforeEach(async ({janggi}) => {
      await janggi.status.undo();
    });

    then("nobody has won", async ({janggi}) => {
      expect(await janggi.status.getWinner()).toBeUndefined();
    });

    then("it is han to move again", async ({janggi}) => {
      expect(await janggi.status.getTurn()).toBe("han");
    });

    then("han may rest the turn or play instead", async ({janggi}) => {
      expect(await janggi.status.canPass()).toBe(true);
      expect(await janggi.board.canBeMoved(1, 4)).toBe(true);
    });
  });
});

given("a game is being played", () => {
  when("a fresh game is dealt after a move has been taken back", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);

      await janggi.status.undo();
      await janggi.settings.startNewGame();
    });

    then("there is nothing to take back or play again on the new game", async ({janggi}) => {
      expect(await janggi.status.canUndo()).toBe(false);
      expect(await janggi.status.canRedo()).toBe(false);
    });
  });
});

import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("two people playing on the clock", () => {
  beforeEach(async ({janggi}) => {
    await janggi.takeHoldOfTime();
    await janggi.settings.clock.setTo("5 min");
  });

  when("a minute passes before anyone has moved", () => {
    beforeEach(async ({janggi}) => {
      await janggi.letTimePass(60);
    });

    then("neither clock has run", async ({janggi}) => {
      await expect.poll(() => janggi.status.getClock("cho")).toEqual({seconds: 300, periods: 3});
      await expect.poll(() => janggi.status.getClock("han")).toEqual({seconds: 300, periods: 3});
    });

    then("the clock can still be changed", async ({janggi}) => {
      expect(await janggi.settings.clock.canChange()).toBe(true);
    });
  });

  given("cho has made the first move", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
    });

    then("the clock can no longer be changed", async ({janggi}) => {
      expect(await janggi.settings.clock.canChange()).toBe(false);
    });

    when("a minute passes", () => {
      beforeEach(async ({janggi}) => {
        await janggi.letTimePass(60);
      });

      then("only han's clock has run", async ({janggi}) => {
        await expect.poll(() => janggi.status.getClock("han")).toEqual({seconds: 240, periods: 3});
        await expect.poll(() => janggi.status.getClock("cho")).toEqual({seconds: 300, periods: 3});
      });
    });

    when("han moves after a minute, and half a minute passes", () => {
      beforeEach(async ({janggi}) => {
        await janggi.letTimePass(60);
        await janggi.board.tap(1, 4);
        await janggi.board.tap(1, 5);
        await janggi.letTimePass(30);
      });

      then("han's clock has stopped where it was and cho's is running", async ({janggi}) => {
        await expect.poll(() => janggi.status.getClock("han")).toEqual({seconds: 240, periods: 3});
        await expect.poll(() => janggi.status.getClock("cho")).toEqual({seconds: 270, periods: 3});
      });
    });

    when("han passes after a minute, and half a minute passes", () => {
      beforeEach(async ({janggi}) => {
        await janggi.letTimePass(60);
        await janggi.status.pass();
        await janggi.letTimePass(30);
      });

      then("the pass counted as han's turn", async ({janggi}) => {
        await expect.poll(() => janggi.status.getClock("han")).toEqual({seconds: 240, periods: 3});
        await expect.poll(() => janggi.status.getClock("cho")).toEqual({seconds: 270, periods: 3});
      });
    });

    when("han's free time runs out", () => {
      beforeEach(async ({janggi}) => {
        await janggi.letTimePass(303);
      });

      then("han is counting down the first period", async ({janggi}) => {
        await expect.poll(() => janggi.status.getClock("han")).toEqual({seconds: 27, periods: 3});
      });
    });

    when("han moves within a period", () => {
      beforeEach(async ({janggi}) => {
        await janggi.letTimePass(310);
        await janggi.board.tap(1, 4);
        await janggi.board.tap(1, 5);
      });

      then("han keeps the period, whole", async ({janggi}) => {
        await expect.poll(() => janggi.status.getClock("han")).toEqual({seconds: 30, periods: 3});
      });
    });

    when("a whole period runs out on han", () => {
      beforeEach(async ({janggi}) => {
        await janggi.letTimePass(335);
      });

      then("han has one fewer", async ({janggi}) => {
        await expect.poll(() => janggi.status.getClock("han")).toEqual({seconds: 25, periods: 2});
      });
    });

    when("han's last period runs out", () => {
      beforeEach(async ({janggi}) => {
        await janggi.letTimePass(390);
      });

      then("han has nothing left", async ({janggi}) => {
        await expect.poll(() => janggi.status.getClock("han")).toEqual({seconds: 0, periods: 0});
      });

      then("cho has won", async ({janggi}) => {
        await expect.poll(() => janggi.status.getWinner()).toBe("cho");
      });

      then("han may no longer rest a turn", async ({janggi}) => {
        await expect.poll(() => janggi.status.canPass()).toBe(false);
      });

      then("han may no longer offer a draw", async ({janggi}) => {
        await expect.poll(() => janggi.status.canOfferDraw()).toBe(false);
      });

      when("the page is reloaded", () => {
        beforeEach(async ({janggi}) => {
          await expect.poll(() => janggi.status.getWinner()).toBe("cho");
          await janggi.reload();
        });

        then("han has still lost on time", async ({janggi}) => {
          await expect.poll(() => janggi.status.getWinner()).toBe("cho");
          await expect.poll(() => janggi.status.getClock("han")).toEqual({seconds: 0, periods: 0});
        });

        then("han still may not rest a turn", async ({janggi}) => {
          await expect.poll(() => janggi.status.canPass()).toBe(false);
        });
      });

      when("a player reaches for a piece anyway", () => {
        beforeEach(async ({janggi}) => {
          await expect.poll(() => janggi.status.getWinner()).toBe("cho");
          await janggi.board.tap(1, 4);
        });

        then("nothing is picked up and nothing is offered", async ({janggi}) => {
          expect(await janggi.board.isSelected(1, 4)).toBe(false);
          expect(await janggi.board.canMoveTo(1, 5)).toBe(false);
        });
      });

      when("a new game is dealt", () => {
        beforeEach(async ({janggi}) => {
          await expect.poll(() => janggi.status.getWinner()).toBe("cho");
          await janggi.settings.startNewGame();
        });

        then("cho may rest a turn again", async ({janggi}) => {
          await expect.poll(() => janggi.status.canPass()).toBe(true);
        });

        when("cho reaches for a piece", () => {
          beforeEach(async ({janggi}) => {
            await janggi.board.tap(1, 7);
          });

          then("it is picked up", async ({janggi}) => {
            expect(await janggi.board.isSelected(1, 7)).toBe(true);
          });
        });
      });
    });

    when("han offers a draw, and han's last period runs out before an answer", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.offerDraw();
        await janggi.letTimePass(390);
      });

      then("the offer is no longer asked", async ({janggi}) => {
        await expect.poll(() => janggi.status.getDrawOfferedBy()).toBeUndefined();
      });
    });

    when("han offers a draw that cho declines, and han's last period runs out", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.offerDraw();
        await janggi.status.declineDraw();
        await janggi.letTimePass(390);
        await expect.poll(() => janggi.status.getWinner()).toBe("cho");
      });

      then("the refusal is no longer reported", async ({janggi}) => {
        expect(await janggi.status.getDrawDeclinedBy()).toBeUndefined();
      });
    });

    then("the move cannot be taken back", async ({janggi}) => {
      expect(await janggi.status.canUndo()).toBe(false);
    });

    when("the two agree a draw and a minute passes", () => {
      beforeEach(async ({janggi}) => {
        await janggi.status.offerDraw();
        await janggi.status.acceptDraw();
        await janggi.letTimePass(60);
      });

      then("the clocks have stopped", async ({janggi}) => {
        await expect.poll(() => janggi.status.getClock("han")).toEqual({seconds: 300, periods: 3});
        await expect.poll(() => janggi.status.getClock("cho")).toEqual({seconds: 300, periods: 3});
      });
    });

    when("a new game is dealt after a minute, and another minute passes", () => {
      beforeEach(async ({janggi}) => {
        await janggi.letTimePass(60);
        await janggi.settings.startNewGame();
        await janggi.letTimePass(60);
      });

      then("both clocks are back to all their time, and waiting", async ({janggi}) => {
        await expect.poll(() => janggi.status.getClock("han")).toEqual({seconds: 300, periods: 3});
        await expect.poll(() => janggi.status.getClock("cho")).toEqual({seconds: 300, periods: 3});
      });

      then("the clock can be changed again", async ({janggi}) => {
        expect(await janggi.settings.clock.canChange()).toBe(true);
      });
    });

    when("twenty seconds pass and the page is reloaded", () => {
      beforeEach(async ({janggi}) => {
        await janggi.letTimePass(20);
        await janggi.reload();
      });

      then("the clock is still on the same format", async ({janggi}) => {
        expect(await janggi.settings.clock.getSelected()).toBe("5 min");
      });

      then("the time han had spent stays spent", async ({janggi}) => {
        await expect.poll(() => janggi.status.getClock("han")).toEqual({seconds: 280, periods: 3});
        await expect.poll(() => janggi.status.getClock("cho")).toEqual({seconds: 300, periods: 3});
      });

      then("the move still cannot be taken back", async ({janggi}) => {
        expect(await janggi.status.canUndo()).toBe(false);
      });

      when("longer than han has left passes", () => {
        beforeEach(async ({janggi}) => {
          await janggi.letTimePass(600);
        });

        then("no time has run", async ({janggi}) => {
          await expect.poll(() => janggi.status.getClock("han")).toEqual({seconds: 280, periods: 3});
          await expect.poll(() => janggi.status.getClock("cho")).toEqual({seconds: 300, periods: 3});
        });

        then("nobody has lost", async ({janggi}) => {
          expect(await janggi.status.getWinner()).toBeUndefined();
        });
      });

      when("time passes and the page is reloaded again", () => {
        beforeEach(async ({janggi}) => {
          await janggi.letTimePass(30);
          await janggi.reload();
        });

        then("the time han had spent still stays spent", async ({janggi}) => {
          await expect.poll(() => janggi.status.getClock("han")).toEqual({seconds: 280, periods: 3});
        });
      });
    });
  });

  given("the generals face each other", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(5, 7);
      await janggi.board.tap(4, 7);
      await janggi.board.tap(5, 4);
      await janggi.board.tap(4, 4);
    });

    when("cho's last period runs out", () => {
      beforeEach(async ({janggi}) => {
        await janggi.letTimePass(390);
      });

      then("cho may no longer call the bikjang", async ({janggi}) => {
        await expect.poll(() => janggi.status.canCallBikjang()).toBe(false);
      });
    });
  });
});

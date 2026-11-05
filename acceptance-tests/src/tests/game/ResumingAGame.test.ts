import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("two people playing on the clock", () => {
  beforeEach(async ({janggi}) => {
    await janggi.takeHoldOfTime();
    await janggi.settings.clock.setTo("5 min");
  });

  when("the page is reloaded before anyone has moved", () => {
    beforeEach(async ({janggi}) => {
      await janggi.reload();
    });

    then("there is nothing to resume", async ({janggi}) => {
      await expect.poll(() => janggi.status.getClock("cho")).toEqual({seconds: 300, periods: 3});
      expect(await janggi.resumeGame.isShown()).toBe(false);
    });
  });

  given("cho has moved and han has thought for twenty seconds", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
      await janggi.letTimePass(20);
    });

    when("the page is reloaded", () => {
      beforeEach(async ({janggi}) => {
        await janggi.reload();
      });

      then("the game waits to be resumed", async ({janggi}) => {
        await expect.poll(() => janggi.resumeGame.isShown()).toBe(true);
      });

      then("it names han as the player to move", async ({janggi}) => {
        expect(await janggi.resumeGame.getPlayerToMove()).toBe("han");
      });

      then("it faces cho, the board not being set to flip for han", async ({janggi}) => {
        expect(await janggi.resumeGame.isTurnedToFaceHan()).toBe(false);
      });

      then("it shows the time han had already spent as spent", async ({janggi}) => {
        expect(await janggi.resumeGame.getClock("han")).toEqual({seconds: 280, periods: 3});
        expect(await janggi.resumeGame.getClock("cho")).toEqual({seconds: 300, periods: 3});
      });

      when("time passes before anyone resumes", () => {
        beforeEach(async ({janggi}) => {
          await janggi.letTimePass(60);
        });

        then("no time has run", async ({janggi}) => {
          expect(await janggi.resumeGame.getClock("han")).toEqual({seconds: 280, periods: 3});
        });
      });

      when("Resume is pressed", () => {
        beforeEach(async ({janggi}) => {
          await janggi.resumeGame.resume();
        });

        then("the dialog is gone", async ({janggi}) => {
          expect(await janggi.resumeGame.isShown()).toBe(false);
        });

        when("half a minute passes", () => {
          beforeEach(async ({janggi}) => {
            await janggi.letTimePass(30);
          });

          then("han's clock runs on from where it was held", async ({janggi}) => {
            await expect.poll(() => janggi.status.getClock("han")).toEqual({seconds: 250, periods: 3});
          });
        });

        when("han moves after half a minute, and another half minute passes", () => {
          beforeEach(async ({janggi}) => {
            await janggi.letTimePass(30);
            await janggi.board.tap(1, 4);
            await janggi.board.tap(1, 5);
            await janggi.letTimePass(30);
          });

          then("han's turn was charged and cho's clock is running", async ({janggi}) => {
            await expect.poll(() => janggi.status.getClock("han")).toEqual({seconds: 250, periods: 3});
            await expect.poll(() => janggi.status.getClock("cho")).toEqual({seconds: 270, periods: 3});
          });
        });

        when("ten seconds pass and the page is reloaded again", () => {
          beforeEach(async ({janggi}) => {
            await janggi.letTimePass(10);
            await janggi.reload();
          });

          then("the game waits to be resumed again, with that time spent too", async ({janggi}) => {
            await expect.poll(() => janggi.resumeGame.isShown()).toBe(true);
            expect(await janggi.resumeGame.getClock("han")).toEqual({seconds: 270, periods: 3});
          });
        });
      });
    });

    when("the board is set to flip for han and the page is reloaded", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.flipBoard.setTo(true);
        await janggi.reload();
      });

      then("the dialog faces han", async ({janggi}) => {
        await expect.poll(() => janggi.resumeGame.isShown()).toBe(true);
        expect(await janggi.resumeGame.isTurnedToFaceHan()).toBe(true);
      });
    });

    when("han's last period runs out and the page is reloaded", () => {
      beforeEach(async ({janggi}) => {
        await janggi.letTimePass(390);
        await expect.poll(() => janggi.status.getWinner()).toBe("cho");
        await janggi.reload();
      });

      then("there is nothing to resume", async ({janggi}) => {
        await expect.poll(() => janggi.status.getWinner()).toBe("cho");
        expect(await janggi.resumeGame.isShown()).toBe(false);
      });
    });
  });
});

given("two people playing with no clock", () => {
  when("a move is made and the page is reloaded", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
      await janggi.reload();
    });

    then("there is nothing to resume", async ({janggi}) => {
      await expect.poll(() => janggi.status.getTurn()).toBe("han");
      expect(await janggi.resumeGame.isShown()).toBe(false);
    });
  });
});

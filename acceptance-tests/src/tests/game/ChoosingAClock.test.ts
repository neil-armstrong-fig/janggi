import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("two people sharing one device", () => {
  when("they read what the clock means in Korean", () => {
    beforeEach(async ({janggi}) => {
      await janggi.visitKoreanGame();
      await janggi.settings.clock.toggleExplanation();
    });

    then("it explains free time in Korean", async ({janggi}) => {
      expect(await janggi.settings.clock.getExplanationWords()).toContain("자유시간");
    });
  });

  when("no clock has been chosen", () => {
    then("a clock is offered", async ({janggi}) => {
      expect(await janggi.settings.clock.isOffered()).toBe(true);
    });

    then("it is off", async ({janggi}) => {
      expect(await janggi.settings.clock.getSelected()).toBe("Off");
    });

    then("neither plaque shows a clock", async ({janggi}) => {
      expect(await janggi.status.isClockShown("cho")).toBe(false);
      expect(await janggi.status.isClockShown("han")).toBe(false);
    });

    then("the formats are not shown", async ({janggi}) => {
      expect(await janggi.settings.clock.areFormatsShown()).toBe(false);
    });
  });

  when("the clock is turned on", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.clock.turnOn();
    });

    then("the formats are shown", async ({janggi}) => {
      expect(await janggi.settings.clock.areFormatsShown()).toBe(true);
    });

    then("it starts on the ten minute format", async ({janggi}) => {
      expect(await janggi.settings.clock.getSelected()).toBe("10 min");
    });

    then("both plaques show that format", async ({janggi}) => {
      expect(await janggi.status.getClock("cho")).toEqual({seconds: 600, periods: 3});
      expect(await janggi.status.getClock("han")).toEqual({seconds: 600, periods: 3});
    });

    when("another format is chosen and the page is reloaded", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.clock.setTo("20 min");
        await janggi.reload();
      });

      then("that format is still chosen", async ({janggi}) => {
        expect(await janggi.settings.clock.getSelected()).toBe("20 min");
      });

      then("both plaques show all its time", async ({janggi}) => {
        expect(await janggi.status.getClock("cho")).toEqual({seconds: 1200, periods: 3});
        expect(await janggi.status.getClock("han")).toEqual({seconds: 1200, periods: 3});
      });
    });

    when("another format is chosen, it is turned off, and the page is reloaded", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.clock.setTo("20 min");
        await janggi.settings.clock.turnOff();
        await janggi.reload();
      });

      then("it is still off", async ({janggi}) => {
        expect(await janggi.settings.clock.getSelected()).toBe("Off");
      });

      when("it is turned on", () => {
        beforeEach(async ({janggi}) => {
          await janggi.settings.clock.turnOn();
        });

        then("it comes back on that format", async ({janggi}) => {
          expect(await janggi.settings.clock.getSelected()).toBe("20 min");
        });
      });
    });

    when("it is turned off again", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.clock.turnOff();
      });

      then("it is off", async ({janggi}) => {
        expect(await janggi.settings.clock.getSelected()).toBe("Off");
      });

      then("the formats are not shown", async ({janggi}) => {
        expect(await janggi.settings.clock.areFormatsShown()).toBe(false);
      });

      then("neither plaque shows a clock", async ({janggi}) => {
        expect(await janggi.status.isClockShown("cho")).toBe(false);
        expect(await janggi.status.isClockShown("han")).toBe(false);
      });
    });
  });

  when("a format is chosen, and the clock is turned off and on again", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.clock.setTo("20 min");
      await janggi.settings.clock.turnOff();
      await janggi.settings.clock.turnOn();
    });

    then("it comes back on that format", async ({janggi}) => {
      expect(await janggi.settings.clock.getSelected()).toBe("20 min");
    });

    then("both plaques show it", async ({janggi}) => {
      expect(await janggi.status.getClock("cho")).toEqual({seconds: 1200, periods: 3});
    });
  });

  when("a format is written out, and the clock is turned off and on again", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.clock.setCustomTo({minutes: 7, periodSeconds: 40, periods: 5});
      await janggi.settings.clock.turnOff();
      await janggi.settings.clock.turnOn();
    });

    then("it comes back with what was written", async ({janggi}) => {
      expect(await janggi.status.getClock("cho")).toEqual({seconds: 420, periods: 5});
    });
  });

  when("cho moves with the clock off", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
    });

    then("the clock can no longer be turned on", async ({janggi}) => {
      expect(await janggi.settings.clock.canChange()).toBe(false);
    });
  });

  when("a format on offer is chosen", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.clock.setTo("5 min");
    });

    then("both plaques show its free time and periods", async ({janggi}) => {
      expect(await janggi.status.getClock("cho")).toEqual({seconds: 300, periods: 3});
      expect(await janggi.status.getClock("han")).toEqual({seconds: 300, periods: 3});
    });
  });

  when("they have not asked what a clock means", () => {
    then("nothing explains it", async ({janggi}) => {
      expect(await janggi.settings.clock.isExplanationShown()).toBe(false);
    });
  });

  when("they ask what a clock means, with it off", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.clock.toggleExplanation();
    });

    then("it explains the overtime periods", async ({janggi}) => {
      expect(await janggi.settings.clock.getExplanationWords()).toContain("3 overtime periods");
    });
  });

  when("a format is written out", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.clock.setCustomTo({minutes: 7, periodSeconds: 40, periods: 5});
    });

    then("both plaques show what was written", async ({janggi}) => {
      expect(await janggi.status.getClock("cho")).toEqual({seconds: 420, periods: 5});
      expect(await janggi.status.getClock("han")).toEqual({seconds: 420, periods: 5});
    });
  });

  when("a format of many short periods is written out", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.clock.setCustomTo({minutes: 5, periodSeconds: 30, periods: 30});
    });

    then("both plaques show all of its periods", async ({janggi}) => {
      expect(await janggi.status.getClock("cho")).toEqual({seconds: 300, periods: 30});
      expect(await janggi.status.getClock("han")).toEqual({seconds: 300, periods: 30});
    });
  });

  when("a format with no time in it at all is written out", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.clock.setCustomTo({minutes: 0, periodSeconds: 30, periods: 0});
    });

    then("each army is given one period", async ({janggi}) => {
      expect(await janggi.status.getClock("cho")).toEqual({seconds: 30, periods: 1});
      expect(await janggi.status.getClock("han")).toEqual({seconds: 30, periods: 1});
    });

    then("the field says so", async ({janggi}) => {
      expect(await janggi.settings.clock.getCustomFigure("periods")).toBe("1");
    });
  });

  given("a format has been written out", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.clock.setCustomTo({minutes: 7, periodSeconds: 40, periods: 5});
    });

    when("the page is reloaded", () => {
      beforeEach(async ({janggi}) => {
        await janggi.reload();
      });

      then("the figures are still there", async ({janggi}) => {
        expect(await janggi.settings.clock.getCustomFigure("minutes")).toBe("7");
        expect(await janggi.settings.clock.getCustomFigure("periodSeconds")).toBe("40");
        expect(await janggi.settings.clock.getCustomFigure("periods")).toBe("5");
      });

      then("the plaques still show them", async ({janggi}) => {
        expect(await janggi.status.getClock("cho")).toEqual({seconds: 420, periods: 5});
      });
    });

    when("a figure over its limit is written", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.clock.typeCustomFigure("minutes", "999");
      });

      then("it comes down to the limit", async ({janggi}) => {
        expect(await janggi.settings.clock.getCustomFigure("minutes")).toBe("180");
      });

      then("the plaques show the limit", async ({janggi}) => {
        expect(await janggi.status.getClock("cho")).toEqual({seconds: 10800, periods: 5});
      });
    });

    when("a figure under its limit is written", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.clock.typeCustomFigure("periodSeconds", "2");
      });

      then("it comes up to the limit", async ({janggi}) => {
        expect(await janggi.settings.clock.getCustomFigure("periodSeconds")).toBe("5");
      });
    });

    when("a field is left blank", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.clock.typeCustomFigure("minutes", "");
      });

      then("it goes back to what it held", async ({janggi}) => {
        expect(await janggi.settings.clock.getCustomFigure("minutes")).toBe("7");
      });

      then("the plaques still show it", async ({janggi}) => {
        expect(await janggi.status.getClock("cho")).toEqual({seconds: 420, periods: 5});
      });
    });

    when("a figure that passes through one under its limit is typed", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.clock.typeCustomFigure("periodSeconds", "30");
      });

      then("it is not corrected along the way", async ({janggi}) => {
        expect(await janggi.settings.clock.getCustomFigure("periodSeconds")).toBe("30");
      });
    });
  });
});

given("a game against the bot", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.clock.setTo("5 min");
    await janggi.settings.opponent.setTo("Bot");
  });

  when("a clock was chosen before the bot was", () => {
    then("a clock is not offered", async ({janggi}) => {
      expect(await janggi.settings.clock.isOffered()).toBe(false);
    });

    then("neither plaque shows a clock", async ({janggi}) => {
      expect(await janggi.status.isClockShown("cho")).toBe(false);
      expect(await janggi.status.isClockShown("han")).toBe(false);
    });
  });
});

given("a move taken back to the start of the game, with no clock", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(1, 7);
    await janggi.board.tap(1, 6);
    await janggi.status.undo();
  });

  when("a clock is then chosen", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.clock.setTo("5 min");
    });

    then("the move cannot be played again", async ({janggi}) => {
      expect(await janggi.status.canRedo()).toBe(false);
    });
  });
});

given("a format written out", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.clock.setCustomTo({minutes: 7, periodSeconds: 40, periods: 5});
  });

  when("play has begun", () => {
    beforeEach(async ({janggi}) => {
      await janggi.board.tap(1, 7);
      await janggi.board.tap(1, 6);
    });

    then("its figures can no longer be changed", async ({janggi}) => {
      expect(await janggi.settings.clock.canWriteOut()).toBe(false);
    });
  });
});

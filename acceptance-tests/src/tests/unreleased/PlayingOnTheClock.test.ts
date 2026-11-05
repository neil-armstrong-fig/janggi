import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("two people sharing one device", () => {
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

  when("they have not asked what a format means", () => {
    then("nothing explains it", async ({janggi}) => {
      expect(await janggi.settings.clock.isExplanationShown()).toBe(false);
    });
  });

  when("they ask what a format means", () => {
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

import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("two people share the device", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.openTheSettings();
    await janggi.settings.play.openGroup("Opponent");
  });

  when("they look at their opponent settings", () => {
    then("the clock is directly available alongside the opponent", async ({janggi}) => {
      expect(await janggi.settings.play.isClockInOpponent()).toBe(true);
      expect(await janggi.settings.play.isClockVisible()).toBe(true);
    });
  });

  when("they set a clock and fold Opponent", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.play.clock.setTo("5 min");
      await janggi.settings.play.openGroup("Format");
    });

    then("the opponent summary includes the clock", async ({janggi}) => {
      expect(await janggi.settings.play.getGroupSummary("Opponent")).toBe("Human · 5 min + 30s ×3");
    });
  });
});

import type {PlayGroupName} from "@janggi/shared/janggi/settings/PlayGroupName";
import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * The Play tab had grown to two or three screens of pickers on a phone, most of them locked once play began. It is
 * folded into groups: each is one line saying what it is set to, and opens in place to change it, one at a time. The player’s last open group is remembered on this device.
 */
given("a player opens the Play tab before the first move", () => {
  when("nothing has been chosen yet", () => {
    then("every group starts collapsed", async ({janggi}) => {
      expect(await janggi.settings.play.isGroupOpen("Setup")).toBe(false);
      expect(await janggi.settings.play.isGroupOpen("Opponent")).toBe(false);
      expect(await janggi.settings.play.isGroupOpen("Format")).toBe(false);
    });
  });
});

given("a game against the bot, its setups chosen", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.play.opponent.setTo("Bot");
    await janggi.settings.play.hanSetup.setTo("Outer Elephant");
    await janggi.settings.play.choSetup.setTo("Inner Elephant");
  });

  when("nothing else has been asked for", () => {
    then("each group says in a line what it is set to", async ({janggi}) => {
      expect(await janggi.settings.play.getGroupSummary("Opponent")).toBe("Bot · 800");
      expect(await janggi.settings.play.getGroupSummary("Format")).toBe("Casual");
      expect(await janggi.settings.play.getGroupSummary("Setup")).toBe("Inner Elephant\nOuter Elephant");
    });

    then("there is no clock to set against the bot", async ({janggi}) => {
      expect(await janggi.settings.play.clock.isOffered()).toBe(false);
    });
  });

  when("they open the opponent group", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.play.openGroup("Opponent");
    });

    then("it opens, and the setups fold away", async ({janggi}) => {
      expect(await janggi.settings.play.isGroupOpen("Opponent")).toBe(true);
      expect(await janggi.settings.play.isGroupOpen("Setup")).toBe(false);
    });
  });

  when("they choose a scored game", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.play.matchFormat.setTo("Scored");
    });

    then("the format's line says so", async ({janggi}) => {
      expect(await janggi.settings.play.getGroupSummary("Format")).toBe("Scored");
    });
  });
});

given("two people share the device", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.play.opponent.setTo("Human");
  });

  when("no clock has been turned on", () => {
    then("the opponent's line names a person", async ({janggi}) => {
      expect(await janggi.settings.play.getGroupSummary("Opponent")).toBe("Human");
    });
  });

  when("they set a clock", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.play.clock.setTo("5 min");
    });

    then("the clock's line names the format", async ({janggi}) => {
      expect(await janggi.settings.play.getGroupSummary("Opponent")).toBe("Human · 5 min + 30s ×3");
    });
  });
});

given("a game is under way", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(1, 7);
    await janggi.board.tap(1, 6);
  });

  when("the player opens the Play tab", () => {
    then("every group is folded to its line, since none can be changed", async ({janggi}) => {
      expect(await janggi.settings.play.isGroupOpen("Setup")).toBe(false);
      expect(await janggi.settings.play.isGroupOpen("Opponent")).toBe(false);
    });
  });

  when("they start a new game", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.play.startNewGame();
    });

    then("the groups retain their collapsed state", async ({janggi}) => {
      expect(await janggi.settings.play.isGroupOpen("Setup")).toBe(false);
    });
  });
});

given("the Play groups are visible", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.openTheSettings();
  });

  when.each(
    ["Setup", "Opponent", "Format"] as const,
    name => `the ${name} group is opened`,
    name => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.play.openGroup(name);
      });

      then("its border and background distinguish it from a folded group", async ({janggi}) => {
        const groupAppearance = await janggi.settings.play.getGroupAppearance(name);
        const foldedName = foldedGroupFor(name);
        const foldedGroupAppearance = await janggi.settings.play.getGroupAppearance(foldedName);

        expect(groupAppearance.border).not.toBe(foldedGroupAppearance.border);
        expect(groupAppearance.background).not.toBe(foldedGroupAppearance.background);
      });

      then("a divider separates its heading from its controls", async ({janggi}) => {
        expect((await janggi.settings.play.getGroupAppearance(name)).dividerWidth).toBeGreaterThan(0);
      });
    },
  );
});

function foldedGroupFor(name: PlayGroupName): PlayGroupName {
  if (name === "Setup") return "Opponent";

  return "Setup";
}

given("the player chooses a Play group", () => {
  when.each(
    ["Opponent", "Format", "Setup"] as const,
    name => `they open ${name} and refresh`,
    name => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.play.openGroup(name);
        await janggi.reload();
      });

      then("that group is still open", async ({janggi}) => {
        expect(await janggi.settings.play.isGroupOpen(name)).toBe(true);
      });
    },
  );
});

given("the player has closed the last open Play group", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.play.openGroup("Setup");
    await janggi.settings.play.closeGroup("Setup");
    await janggi.reload();
  });

  when("they return to Play", () => {
    then("every group stays collapsed", async ({janggi}) => {
      expect(await janggi.settings.play.isGroupOpen("Setup")).toBe(false);
      expect(await janggi.settings.play.isGroupOpen("Opponent")).toBe(false);
      expect(await janggi.settings.play.isGroupOpen("Format")).toBe(false);
    });
  });
});

import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the other settings tabs", () => {
  when("the player first looks", () => {
    then("Look and You start folded", async ({janggi}) => {
      expect(await janggi.settings.look.isGroupOpen("Board")).toBe(false);
      expect(await janggi.settings.look.isGroupOpen("Pieces")).toBe(false);
      expect(await janggi.settings.look.isGroupOpen("BoardHints")).toBe(false);
      expect(await janggi.settings.you.isGroupOpen("Account")).toBe(false);
      expect(await janggi.settings.you.isGroupOpen("SaveTransfer")).toBe(false);
    });
  });

  when("they open Board then Pieces", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.look.openGroup("Board");
      await janggi.settings.look.openGroup("Pieces");
    });

    then("only Pieces stays open", async ({janggi}) => {
      expect(await janggi.settings.look.isGroupOpen("Board")).toBe(false);
      expect(await janggi.settings.look.isGroupOpen("Pieces")).toBe(true);
    });
  });

  when("they open Account then save transfer", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.you.openGroup("Account");
      await janggi.settings.you.openGroup("SaveTransfer");
    });

    then("only save transfer stays open", async ({janggi}) => {
      expect(await janggi.settings.you.isGroupOpen("Account")).toBe(false);
      expect(await janggi.settings.you.isGroupOpen("SaveTransfer")).toBe(true);
    });
  });

  when("they open groups on different tabs and choose another board", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.look.openGroup("Pieces");
      await janggi.settings.you.openGroup("Account");
      await janggi.settings.look.board.setTo("Neon");
    });

    then("each tab keeps its open group and the summary follows the choice", async ({janggi}) => {
      expect(await janggi.settings.look.isGroupOpen("Pieces")).toBe(true);
      expect(await janggi.settings.you.isGroupOpen("Account")).toBe(true);
      expect(await janggi.settings.look.getGroupSummary("Board")).toBe("Neon");
    });
  });

  when("a group is closed again", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.look.openGroup("Board");
      await janggi.settings.look.closeGroup("Board");
    });

    then("its controls fold away", async ({janggi}) => {
      expect(await janggi.settings.look.isGroupOpen("Board")).toBe(false);
    });
  });
});

given("a signed-out player chooses Online", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.play.games.chooseOnline();
  });

  when("You opens to offer sign-in", () => {
    then("Account is expanded with sign-in directly visible", async ({janggi}) => {
      expect(await janggi.settings.you.isGroupOpen("Account")).toBe(true);
      await expect.poll(() => janggi.settings.you.isAccountSignInVisible()).toBe(true);
    });
  });
});

given("the Look groups are on screen", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.openTheSettings();
    await janggi.settings.selectTab("Look");
    await janggi.settings.look.openGroup("Board");
  });

  when("Board is expanded", () => {
    then("it has the approved expanded styling and divider", async ({janggi}) => {
      const groupAppearance = await janggi.settings.look.getGroupAppearance("Board");
      const foldedGroupAppearance = await janggi.settings.look.getGroupAppearance("Pieces");

      expect(groupAppearance.border).not.toBe(foldedGroupAppearance.border);
      expect(groupAppearance.background).not.toBe(foldedGroupAppearance.background);
      expect(groupAppearance.dividerWidth).toBeGreaterThan(0);
    });
  });
});

given("Sound is opened", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.openTheSettings();
    await janggi.settings.selectTab("Sound");
  });

  when("no group has been opened", () => {
    then("all three controls are directly accessible", async ({janggi}) => {
      expect(await janggi.settings.sound.isEveryControlVisible()).toBe(true);
    });
  });
});

given("You is opened", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.openTheSettings();
    await janggi.settings.selectTab("You");
  });

  when("Account is folded", () => {
    then("language, progress and help remain visible", async ({janggi}) => {
      expect(await janggi.settings.you.isPlayerOverviewVisible()).toBe(true);
      expect(await janggi.settings.you.getGroupSummary("Account")).toBe("Signed out");
    });
  });
});

given("Look choices are split between armies", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.look.board.toggleChoosingApart();
    await janggi.settings.look.board.chooseForArmy("han", "Neon");
  });

  when("the group is folded", () => {
    then("its summary names both armies' choices", async ({janggi}) => {
      expect(await janggi.settings.look.getGroupSummary("Board")).toContain("Classic");
      expect(await janggi.settings.look.getGroupSummary("Board")).toContain("Neon");
    });
  });
});

given("a Look group was open before a reload", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.look.openGroup("Pieces");
    await janggi.reload();
  });

  when("the page returns", () => {
    then("Look starts folded again", async ({janggi}) => {
      expect(await janggi.settings.look.isGroupOpen("Pieces")).toBe(false);
    });
  });
});

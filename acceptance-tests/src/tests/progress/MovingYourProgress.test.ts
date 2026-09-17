import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {saveKeyWith} from "@src/shared/share-keys/SaveKeyWith";

/**
 * Progress is only ever kept on the device, so a save key is how a player takes it anywhere else: copy
 * it out, and load it where they want it. A new device is a fresh page, which is what loading a save
 * with nothing in it stands in for.
 */
given("a player who has earned some progress", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 640, beaten: {Casual: {cho: [800, 1000]}}}));
  });

  when("they look at their progress", () => {
    then("their XP is shown", async ({janggi}) => {
      expect(await janggi.settings.progress.getXp()).toBe(640);
    });

    then("the next unlock is the first one past what they hold", async ({janggi}) => {
      expect(await janggi.settings.progress.getNextUnlockXp()).toBe(1200);
    });
  });

  when("they take on the bot", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.opponent.setTo("Bot");
    });

    then("their own plaque shows the XP they have earned", async ({janggi}) => {
      expect(await janggi.status.getShownXp("cho")).toBe(640);
    });

    then("the bot's plaque shows none, having none to earn", async ({janggi}) => {
      expect(await janggi.status.getShownXp("han")).toBeUndefined();
    });

    when("their screen is narrow", () => {
      beforeEach(async ({janggi}) => {
        await janggi.resizeWindowTo(390, 844);
      });

      then("the next unlock is left to the Progress settings", async ({janggi}) => {
        expect(await janggi.status.getNextUnlock("cho")).toBeUndefined();
      });

      then("the XP amount and its unit stay on one line", async ({janggi}) => {
        expect(await janggi.status.isXpOnOneLine("cho")).toBe(true);
      });
    });
  });

  when("they come back to the game later", () => {
    beforeEach(async ({janggi}) => {
      await janggi.reload();
    });

    then("their XP is still there", async ({janggi}) => {
      expect(await janggi.settings.progress.getXp()).toBe(640);
    });
  });

  when("they copy their save key, start again from nothing, and load the key", () => {
    beforeEach(async ({janggi}) => {
      const key = await janggi.settings.progress.getSaveKey();
      await janggi.settings.progress.loadSave(saveKeyWith({xp: 0}));
      await janggi.settings.progress.loadSave(key);
    });

    then("their XP is back", async ({janggi}) => {
      expect(await janggi.settings.progress.getXp()).toBe(640);
    });

    then("the bots they had beaten are open to them again", async ({janggi}) => {
      expect(await janggi.settings.botStrength.isLocked(1200)).toBe(false);
    });
  });

  when("they paste something that is not a save key", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.progress.loadSave("my progress, please");
    });

    then("they are told it is not one", async ({janggi}) => {
      expect(await janggi.settings.progress.isSaveRefused()).toBe(true);
    });

    then("their XP is untouched", async ({janggi}) => {
      expect(await janggi.settings.progress.getXp()).toBe(640);
    });
  });
});

given("a player starting from nothing", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 0}));
  });

  when("they look at their progress", () => {
    then("the first unlock is 30 XP away", async ({janggi}) => {
      expect(await janggi.settings.progress.getNextUnlockXp()).toBe(30);
    });
  });

  when("they play the bot", () => {
    beforeEach(async ({janggi}) => {
      await janggi.resizeWindowTo(1024, 900);
      await janggi.settings.opponent.setTo("Bot");
    });

    then("their plaque says what the next unlock costs and opens", async ({janggi}) => {
      expect(await janggi.status.getNextUnlock("cho")).toBe("(Next unlock: 30 XP, unlock Hanja pieces)");
    });

    then("all the pieces they could lose still fit beside it at full size", async ({janggi}) => {
      expect(await janggi.status.canShowAllTakenPieces("cho")).toBe(true);
    });

    then("the XP amount and its unit stay on one line", async ({janggi}) => {
      expect(await janggi.status.isXpOnOneLine("cho")).toBe(true);
    });
  });
});

import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {saveKeyWith} from "@src/shared/share-keys/SaveKeyWith";

/**
 * Each strength of bot opens once the one beneath it has been beaten, and each of the four ladders is
 * climbed on its own: Cho and Han apart, and the casual game apart from the scored one. A win against
 * the bot cannot be tapped out in a spec, so the wins are carried in a loaded save; what a ladder opens
 * is unit tested beneath the page.
 */
given("a player who has beaten no bot", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 0}));
    await janggi.settings.opponent.setTo("Bot");
  });

  when("they look at the strengths on offer", () => {
    then("the weakest bot may be played", async ({janggi}) => {
      expect(await janggi.settings.botStrength.isLocked(800)).toBe(false);
    });

    then("the next strength up is locked", async ({janggi}) => {
      expect(await janggi.settings.botStrength.isLocked(1000)).toBe(true);
    });

    then("the bot is set to the weakest", async ({janggi}) => {
      expect(await janggi.settings.botStrength.getSelected()).toBe(800);
    });
  });
});

given("a player who has beaten the weakest bot as Cho in a casual game", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 30, beaten: {Casual: {cho: [800]}}}));
    await janggi.settings.opponent.setTo("Bot");
  });

  when("they play as Cho", () => {
    then("the next strength up may be played", async ({janggi}) => {
      expect(await janggi.settings.botStrength.isLocked(1000)).toBe(false);
    });

    then("the strength above that is still locked", async ({janggi}) => {
      expect(await janggi.settings.botStrength.isLocked(1200)).toBe(true);
    });
  });

  when("they take Han instead", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.yourSide.setTo("Han");
    });

    then("the next strength up is locked, each army climbing on its own", async ({janggi}) => {
      expect(await janggi.settings.botStrength.isLocked(1000)).toBe(true);
    });
  });

  when("they take a random side", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.yourSide.setTo("Random");
    });

    then("only what both armies have reached may be played", async ({janggi}) => {
      expect(await janggi.settings.botStrength.isLocked(1000)).toBe(true);
    });
  });

  when("they play the scored game instead", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.matchFormat.setTo("Scored");
    });

    then("the next strength up is locked, the two games being climbed apart", async ({janggi}) => {
      expect(await janggi.settings.botStrength.isLocked(1000)).toBe(true);
    });

    then("the bot drops to the weakest, which is as far as that ladder goes", async ({janggi}) => {
      expect(await janggi.settings.botStrength.getSelected()).toBe(800);
    });
  });

  when("they set the bot a strength up and then take Han", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.botStrength.setTo(1000);
      await janggi.settings.yourSide.setTo("Han");
    });

    then("the bot drops to the strongest Han may face", async ({janggi}) => {
      expect(await janggi.settings.botStrength.getSelected()).toBe(800);
    });
  });
});

/** A hand-edited save can name any rung; it is the climb that opens the next one, not the naming. */
given("a player holding a save that names a strong bot but none beneath it", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.progress.loadSave(saveKeyWith({xp: 0, beaten: {Casual: {cho: [1600]}}}));
    await janggi.settings.opponent.setTo("Bot");
  });

  when("they look at the strengths on offer", () => {
    then("the strength it names is locked", async ({janggi}) => {
      expect(await janggi.settings.botStrength.isLocked(1600)).toBe(true);
    });

    then("so is the one above the bottom, the ladder being climbed from there", async ({janggi}) => {
      expect(await janggi.settings.botStrength.isLocked(1000)).toBe(true);
    });
  });
});

given("a player set against a strong bot", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.opponent.setTo("Bot");
    await janggi.settings.botStrength.setTo(2200);
  });

  when("they load a save that has beaten no bot", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.progress.loadSave(saveKeyWith({xp: 0}));
    });

    then("the bot drops to the weakest, the game not having begun", async ({janggi}) => {
      expect(await janggi.settings.botStrength.getSelected()).toBe(800);
    });
  });
});

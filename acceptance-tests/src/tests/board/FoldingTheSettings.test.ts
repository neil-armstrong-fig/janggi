import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * The settings sheet grew long enough that finding the piece set meant scrolling past the whole of a
 * game's setup. Each section folds away under its heading. The game's own settings start laid out,
 * being what a player opens the sheet for before a game; how it looks and how it sounds start folded.
 */
given("a player opens the settings", () => {
  when("nothing has been folded or unfolded yet", () => {
    then("this game's settings are laid out", async ({janggi}) => {
      expect(await janggi.settings.isSectionFolded("This game")).toBe(false);
    });

    then("the appearance and the sound are folded away", async ({janggi}) => {
      expect(await janggi.settings.isSectionFolded("Appearance")).toBe(true);
      expect(await janggi.settings.isSectionFolded("Sound & effects")).toBe(true);
    });
  });

  when("they unfold the appearance", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.unfoldSection("Appearance");
    });

    then("its settings are laid out", async ({janggi}) => {
      expect(await janggi.settings.isSectionFolded("Appearance")).toBe(false);
    });

    then("the sound is left folded, each section folding on its own", async ({janggi}) => {
      expect(await janggi.settings.isSectionFolded("Sound & effects")).toBe(true);
    });
  });

  when("they fold this game's settings away", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.foldSection("This game");
    });

    then("they are folded away", async ({janggi}) => {
      expect(await janggi.settings.isSectionFolded("This game")).toBe(true);
    });

    then("the game's settings are kept as they were, folding hiding them and nothing more", async ({janggi}) => {
      expect(await janggi.settings.matchFormat.getSelected()).toBe("Casual");
    });
  });
});

import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * The settings sheet grew long enough that finding the piece set meant scrolling past the whole of a
 * game's setup, and a sheet that long hid the board it was changing. It is divided into tabs, one
 * pane showing at a time. The game's own settings show first, being what a player opens the sheet for
 * before a game; how it looks, how it sounds and how far along they are wait a tab away.
 */
given("a player opens the settings", () => {
  when("nothing has been chosen yet", () => {
    then("the game's settings are showing", async ({janggi}) => {
      expect(await janggi.settings.isTabShowing("Game")).toBe(true);
    });

    then("the look, the sound and the progress are a tab away", async ({janggi}) => {
      expect(await janggi.settings.isTabShowing("Look")).toBe(false);
      expect(await janggi.settings.isTabShowing("Sound")).toBe(false);
      expect(await janggi.settings.isTabShowing("Progress")).toBe(false);
    });
  });

  when("they choose the look tab", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.selectTab("Look");
    });

    then("its settings are showing", async ({janggi}) => {
      expect(await janggi.settings.isTabShowing("Look")).toBe(true);
    });

    then("its tab is marked as the one chosen", async ({janggi}) => {
      expect(await janggi.settings.isTabSelected("Look")).toBe(true);
      expect(await janggi.settings.isTabSelected("Game")).toBe(false);
    });

    then("the game's settings are put away, one pane showing at a time", async ({janggi}) => {
      expect(await janggi.settings.isTabShowing("Game")).toBe(false);
    });
  });

  when("they play a scored game and then choose the look tab", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.matchFormat.setTo("Scored");
      await janggi.settings.selectTab("Look");
    });

    then("the game's settings are kept as they were, a tab hiding them and nothing more", async ({janggi}) => {
      expect(await janggi.settings.matchFormat.getSelected()).toBe("Scored");
    });
  });

  when("they change a setting on another tab", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.pieceSet.setTo("Hangul");
    });

    then("the tab they were on is still the one showing, put back as they left it", async ({janggi}) => {
      expect(await janggi.settings.isTabShowing("Game")).toBe(true);
    });
  });
});

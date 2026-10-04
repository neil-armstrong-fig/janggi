import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * A sheet is always shown from its top. A player who read down the You tab and shut the sheet would otherwise find it
 * where they left it, and anything that opens a tab to point at something at its top — the tour, the sign-in a tap on
 * Online leads to — would be pointing at a part of the page that has scrolled out of sight.
 */
given("the You settings were read to the bottom, and the sheet was shut", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.scrollTabToTheEnd("You");
  });

  then("they were scrolled down, which is what the other cases put right", async ({janggi}) => {
    expect(await janggi.settings.getTabScroll("You")).toBeGreaterThan(0);
  });

  when("the settings are opened again", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.openTheSettings();
    });

    then("the You tab is at its top", async ({janggi}) => {
      await expect.poll(() => janggi.settings.getTabScroll("You")).toBe(0);
    });
  });

  when("a signed-out player chooses Online", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.games.chooseOnline();
    });

    then("the You tab is at its top, with the sign-in in view", async ({janggi}) => {
      await expect.poll(() => janggi.settings.getTabScroll("You")).toBe(0);
    });
  });
});

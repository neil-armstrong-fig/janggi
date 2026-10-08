import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * Chrome on Android draws the page under its navigation buttons and reports their height as
 * `safe-area-inset-bottom`. A layout that lets the lowest controls sit in that strip hides them.
 */
const NAVIGATION_BAR_HEIGHT = 48;

given("a user has the game open", () => {
  when("a system bar covers the bottom of the window", () => {
    beforeEach(async ({janggi}) => {
      await janggi.coverTheBottomOfTheWindow(NAVIGATION_BAR_HEIGHT);
    });

    then("the controls are still above it", async ({janggi}) => {
      expect(await janggi.status.areControlsClearOfTheBottom(NAVIGATION_BAR_HEIGHT)).toBe(true);
    });
  });
});

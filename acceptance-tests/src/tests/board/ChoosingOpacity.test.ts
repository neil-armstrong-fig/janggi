import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {DEFAULT_OPACITY, FULL_OPACITY, MINIMUM_OPACITY} from "@janggi/shared/janggi/settings/Opacity";

/**
 * The settings sheet's own panel is a little see-through, and how much is a player's own choice —
 * the same blur reads differently on a phone and a desktop browser, and neither is wrong.
 *
 * What is seen is not something a browser test can check pixel by pixel (`ChoosingSound.test.ts` has
 * the same reasoning about what a test can hear); this covers the choice a player makes and the
 * bounds the slider holds it to.
 */
given("a user opens the game", () => {
  when("the page has loaded", () => {
    then("the sheet's opacity is at its default", async ({janggi}) => {
      expect(await janggi.settings.opacity.getOpacity()).toBe(DEFAULT_OPACITY);
    });

    then("the slider goes no lower than the floor", async ({janggi}) => {
      expect(await janggi.settings.opacity.getMinimum()).toBe(MINIMUM_OPACITY);
    });

    then("the slider goes no higher than fully opaque", async ({janggi}) => {
      expect(await janggi.settings.opacity.getMaximum()).toBe(FULL_OPACITY);
    });
  });

  when("the opacity is slid to its floor", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.opacity.setTo(MINIMUM_OPACITY);
    });

    then("the sheet is kept that see-through", async ({janggi}) => {
      expect(await janggi.settings.opacity.getOpacity()).toBe(MINIMUM_OPACITY);
    });
  });

  when("the opacity is slid to fully opaque", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.opacity.setTo(FULL_OPACITY);
    });

    then("the sheet is kept fully opaque", async ({janggi}) => {
      expect(await janggi.settings.opacity.getOpacity()).toBe(FULL_OPACITY);
    });
  });
});

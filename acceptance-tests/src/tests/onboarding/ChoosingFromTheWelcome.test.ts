import {FULL_VOLUME, MUTED_VOLUME} from "@janggi/shared/janggi/settings/Volume";
import {
  beforeEach,
  expect,
  given,
  then,
  useFreshPlayer,
  when,
} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * The welcome's second screen: how the game sounds and moves, asked before the first tap, since the
 * first tap is what starts the music. Each choice is worn the moment it is made, so what these specs
 * read is the settings sheet the player would find them in — the same preference, not a copy of it.
 *
 * The specs run on a device that asks for reduced motion (the projects say so), and the animations still
 * start in full: they are a choice offered here, not one made from the device.
 */
given("a player at the welcome, who has read what Janggi is", () => {
  useFreshPlayer();

  beforeEach(async ({janggi}) => {
    await janggi.onboarding.continueTheWelcome();
  });

  when("the choices are offered", () => {
    then("they are told they can change them again in Settings", async ({janggi}) => {
      expect(await janggi.onboarding.getWelcomeText()).toContain("You can change all of these any time in Settings");
    });
  });

  when("they start the tour without changing anything", () => {
    beforeEach(async ({janggi}) => {
      await janggi.onboarding.startTheTour();
      await janggi.onboarding.skipTheTour();
    });

    then("the welcome is gone", async ({janggi}) => {
      expect(await janggi.onboarding.isWelcomeShown()).toBe(false);
    });

    then("the music and the sound effects are on", async ({janggi}) => {
      expect(await janggi.settings.music.getVolume()).toBe(FULL_VOLUME);
      expect(await janggi.settings.soundEffects.getVolume()).toBe(FULL_VOLUME);
    });

    then("the animations are in full, whatever the device says about motion", async ({janggi}) => {
      expect(await janggi.settings.effects.getSelected()).toBe("Full");
    });

    then("the movable pieces are marked", async ({janggi}) => {
      expect(await janggi.settings.movableHighlight.getSelected()).toBe("Shown");
    });
  });

  when("they turn the music off and start the tour", () => {
    beforeEach(async ({janggi}) => {
      await janggi.onboarding.setWelcomeMusicTo("Off");
      await janggi.onboarding.startTheTour();
      await janggi.onboarding.skipTheTour();
    });

    then("the music is muted and the sound effects are not", async ({janggi}) => {
      expect(await janggi.settings.music.getVolume()).toBe(MUTED_VOLUME);
      expect(await janggi.settings.soundEffects.getVolume()).toBe(FULL_VOLUME);
    });
  });

  when("they turn the sound effects off and start the tour", () => {
    beforeEach(async ({janggi}) => {
      await janggi.onboarding.setWelcomeSoundEffectsTo("Off");
      await janggi.onboarding.startTheTour();
      await janggi.onboarding.skipTheTour();
    });

    then("the sound effects are muted and the music is not", async ({janggi}) => {
      expect(await janggi.settings.soundEffects.getVolume()).toBe(MUTED_VOLUME);
      expect(await janggi.settings.music.getVolume()).toBe(FULL_VOLUME);
    });
  });

  when("they ask for reduced animations and start the tour", () => {
    beforeEach(async ({janggi}) => {
      await janggi.onboarding.setWelcomeAnimationsTo("Reduced");
      await janggi.onboarding.startTheTour();
      await janggi.onboarding.skipTheTour();
    });

    then("the animations are reduced", async ({janggi}) => {
      expect(await janggi.settings.effects.getSelected()).toBe("Reduced");
    });
  });

  when("they hide where a piece can move and start the tour", () => {
    beforeEach(async ({janggi}) => {
      await janggi.onboarding.setWelcomeMovableHighlightTo("Hidden");
      await janggi.onboarding.startTheTour();
      await janggi.onboarding.skipTheTour();
    });

    then("the movable pieces are no longer marked", async ({janggi}) => {
      expect(await janggi.settings.movableHighlight.getSelected()).toBe("Hidden");
    });
  });
});

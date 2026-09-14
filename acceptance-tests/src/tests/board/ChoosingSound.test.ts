import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {FULL_VOLUME, MUTED_VOLUME} from "@janggi/shared/janggi/settings/Volume";

/**
 * The sound effects and the music are two volumes, not one: plenty of players want the clack of a
 * piece set down and no music under it, and some want the music quiet under a loud board.
 *
 * What is heard is not something a browser test can listen to. Which sounds a change makes, and what
 * the music does as a game grows tense, are covered by the unit tests beside `useGameAudio`, in
 * `webapp/src/react/pages/game/hooks/use-game-audio/`; this covers the choice a player makes.
 */
given("a user opens the game", () => {
  when("the page has loaded", () => {
    then("the sound effects are at full volume", async ({janggi}) => {
      expect(await janggi.settings.soundEffects.getVolume()).toBe(FULL_VOLUME);
    });

    then("the music is at full volume", async ({janggi}) => {
      expect(await janggi.settings.music.getVolume()).toBe(FULL_VOLUME);
    });

    then("neither is shown as muted", async ({janggi}) => {
      expect(await janggi.settings.soundEffects.isMuted()).toBe(false);
      expect(await janggi.settings.music.isMuted()).toBe(false);
    });
  });

  when("the music is turned down", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.music.setTo(40);
    });

    then("the music is at that volume", async ({janggi}) => {
      expect(await janggi.settings.music.getVolume()).toBe(40);
    });

    then("the music is not shown as muted", async ({janggi}) => {
      expect(await janggi.settings.music.isMuted()).toBe(false);
    });

    then("the sound effects are left at full volume", async ({janggi}) => {
      expect(await janggi.settings.soundEffects.getVolume()).toBe(FULL_VOLUME);
    });
  });

  when("the sound effects are slid all the way down", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.soundEffects.setTo(MUTED_VOLUME);
    });

    then("the sound effects are shown as muted", async ({janggi}) => {
      expect(await janggi.settings.soundEffects.isMuted()).toBe(true);
    });

    then("the music is left at full volume", async ({janggi}) => {
      expect(await janggi.settings.music.getVolume()).toBe(FULL_VOLUME);
    });
  });

  when("the music is muted", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.music.toggleMute();
    });

    then("the music is silent", async ({janggi}) => {
      expect(await janggi.settings.music.getVolume()).toBe(MUTED_VOLUME);
    });

    then("the music is shown as muted", async ({janggi}) => {
      expect(await janggi.settings.music.isMuted()).toBe(true);
    });

    then("the sound effects are left unmuted", async ({janggi}) => {
      expect(await janggi.settings.soundEffects.isMuted()).toBe(false);
    });
  });

  when("the music is turned down, muted and unmuted again", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.music.setTo(40);
      await janggi.settings.music.toggleMute();
      await janggi.settings.music.toggleMute();
    });

    then("the music is back at the volume it was turned down to", async ({janggi}) => {
      expect(await janggi.settings.music.getVolume()).toBe(40);
    });
  });
});

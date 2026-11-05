import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * A clock's last ten seconds tick out, one beat a second, so a player hears time running short without looking at it.
 * Some find that stressful, so it can be turned off; it is on until it is.
 *
 * What is heard is not something a browser test can listen to. When the ticks fall, and that none do with the switch
 * off, is covered by the unit tests beside `useGameAudio` and `countdownTicksOf` in `webapp/src/`; this covers the
 * choice a player makes.
 */
given("a user opens the game", () => {
  then("the countdown is on", async ({janggi}) => {
    expect(await janggi.settings.sound.countdown.isOn()).toBe(true);
  });

  when("the countdown is turned off", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.sound.countdown.setTo(false);
    });

    then("it is off", async ({janggi}) => {
      expect(await janggi.settings.sound.countdown.isOn()).toBe(false);
    });

    when("the page is reloaded", () => {
      beforeEach(async ({janggi}) => {
        await janggi.reload();
      });

      then("it is still off", async ({janggi}) => {
        expect(await janggi.settings.sound.countdown.isOn()).toBe(false);
      });
    });

    when("it is turned back on", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.sound.countdown.setTo(true);
      });

      then("it is on", async ({janggi}) => {
        expect(await janggi.settings.sound.countdown.isOn()).toBe(true);
      });
    });
  });
});

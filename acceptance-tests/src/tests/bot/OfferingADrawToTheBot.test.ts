import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * A draw offered to the bot, which answers on its own. It takes one only where the game has nothing
 * left to play for — each army under thirty points — and while it is not clearly winning, both of
 * which are far past what anyone can tap to, so `WouldAcceptADraw.test.ts` covers the accepting. What
 * a player can see from the opening is the other half: that the offer is answered at all, and that a
 * bot turning it down says so rather than leaving the offer to vanish. See `docs/rules.md` §6.4.
 */
given("a player takes on the bot, and the game has just begun", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.opponent.setTo("Bot");
    await janggi.settings.botStrength.setTo(800);
  });

  when("cho offers the bot a draw", () => {
    beforeEach(async ({janggi}) => {
      await janggi.status.offerDraw();
    });

    then("the bot turns it down, the game being nowhere near its end", async ({janggi}) => {
      expect(await janggi.status.getDrawDeclinedBy()).toBe("han");
    });

    then("the game carries on with cho to move, nobody having won or drawn", async ({janggi}) => {
      expect(await janggi.status.getDrawDeclinedBy()).toBe("han");
      expect(await janggi.status.isDrawn()).toBe(false);
      expect(await janggi.status.getTurn()).toBe("cho");
    });

    then("no question is put to han, the bot answering for itself", async ({janggi}) => {
      expect(await janggi.status.getDrawOfferedBy()).toBeUndefined();
    });
  });
});

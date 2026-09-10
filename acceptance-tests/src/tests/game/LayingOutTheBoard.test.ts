import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * 판차림 — the phase before a scored game, in which Han lays its back rank out first, Cho answers
 * having seen it, and Han may not then re-arrange. Cho moves first in exchange, and takes the 1.5
 * 덤 for it. `docs/rules.md` §6.6.
 *
 * It is a rule of the KJA's tournament regulation rather than of janggi, so a casual game is not
 * held to it — the criteria below are in two halves for exactly that reason, and the casual half is
 * the one that says nothing changed.
 */
given("a scored game is being laid out", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.matchFormat.setTo("Scored");
  });

  when("nobody has laid out yet", () => {
    then("the board is waiting on han, and neither army has chosen", async ({janggi}) => {
      expect(await janggi.status.isLayingOut()).toBe(true);
      expect(await janggi.status.getTurn()).toBe("han");
      expect(await janggi.settings.hanSetup.getSelected()).toBeUndefined();
      expect(await janggi.settings.choSetup.getSelected()).toBeUndefined();
    });

    then("han may lay out and cho may not", async ({janggi}) => {
      expect(await janggi.settings.hanSetup.isChoosable()).toBe(true);
      expect(await janggi.settings.choSetup.isChoosable()).toBe(false);
    });

    then("the turn may not be rested either, there being no turn yet", async ({janggi}) => {
      expect(await janggi.status.canPass()).toBe(false);
    });

    when("a piece is tapped anyway", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(1, 7);
      });

      then("it is not picked up, and nothing lights up for it", async ({janggi}) => {
        expect(await janggi.board.isSelected(1, 7)).toBe(false);
        expect(await janggi.board.canMoveTo(1, 6)).toBe(false);
      });
    });
  });

  when("han has laid out", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.hanSetup.setTo("Left Elephant");
    });

    then("han may not lay out again", async ({janggi}) => {
      expect(await janggi.settings.hanSetup.isChoosable()).toBe(false);
      expect(await janggi.settings.hanSetup.getSelected()).toBe("Left Elephant");
    });

    then("cho may answer now that there is something to answer", async ({janggi}) => {
      expect(await janggi.settings.choSetup.isChoosable()).toBe(true);
    });

    then("the board is waiting on cho, and still nothing may be played", async ({janggi}) => {
      expect(await janggi.status.isLayingOut()).toBe(true);
      expect(await janggi.status.getTurn()).toBe("cho");
      expect(await janggi.status.canPass()).toBe(false);
    });

    then("han's own arrangement is already standing on the board", async ({janggi}) => {
      expect(await janggi.board.getPieceAt(2, 1)).toEqual({side: "han", type: "elephant"});
    });
  });

  when("cho has answered", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.hanSetup.setTo("Left Elephant");
      await janggi.settings.choSetup.setTo("Inner Elephant");
    });

    then("the game begins, with cho to move", async ({janggi}) => {
      expect(await janggi.status.isLayingOut()).toBe(false);
      expect(await janggi.status.getTurn()).toBe("cho");
    });

    then("the turn may now be rested, there being a turn to rest", async ({janggi}) => {
      expect(await janggi.status.canPass()).toBe(true);
    });

    when("cho picks a soldier up", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(1, 7);
      });

      then("it comes up, and the point ahead of it lights", async ({janggi}) => {
        expect(await janggi.board.isSelected(1, 7)).toBe(true);
        expect(await janggi.board.canMoveTo(1, 6)).toBe(true);
      });
    });

    then("cho may still change its mind, which is what the deom pays for", async ({janggi}) => {
      expect(await janggi.settings.choSetup.isChoosable()).toBe(true);
    });

    then("han still may not", async ({janggi}) => {
      expect(await janggi.settings.hanSetup.isChoosable()).toBe(false);
    });
  });
});

/**
 * The other half: a casual game is not held to a tournament regulation, and this is what says the
 * behaviour that was there before the rule arrived is still there.
 */
given("a casual game is being laid out", () => {
  when("the page has loaded", () => {
    then("there is no laying-out phase at all", async ({janggi}) => {
      expect(await janggi.status.isLayingOut()).toBe(false);
      expect(await janggi.status.getTurn()).toBe("cho");
    });

    then("both armies open on the common arrangement", async ({janggi}) => {
      expect(await janggi.settings.hanSetup.getSelected()).toBe("Inner Elephant");
      expect(await janggi.settings.choSetup.getSelected()).toBe("Inner Elephant");
    });

    then("either army may arrange, in any order", async ({janggi}) => {
      expect(await janggi.settings.canChooseSetups()).toBe(true);
    });
  });

  when("cho arranges before han, which a scored game would refuse", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.choSetup.setTo("Outer Elephant");
      await janggi.settings.hanSetup.setTo("Left Elephant");
    });

    then("both arrangements took, and han may still think again", async ({janggi}) => {
      expect(await janggi.settings.choSetup.getSelected()).toBe("Outer Elephant");
      expect(await janggi.settings.hanSetup.getSelected()).toBe("Left Elephant");
      expect(await janggi.settings.hanSetup.isChoosable()).toBe(true);
    });
  });
});

/**
 * 맞상 / 엇상 — whether the two outer elephants end up on one wing or facing each other across the
 * board. It falls out of both choices rather than either, it is shown and never enforced, and a
 * pairing of anything but two 귀마 arrangements is not one the game has a name for.
 * `docs/opening-setups.md` §5 and §7.
 */
given("both armies have chosen where their elephants stand", () => {
  when("they choose the same asymmetric arrangement", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.setBothSetupsTo("Left Elephant");
    });

    then("the board says it is eotsang", async ({janggi}) => {
      expect(await janggi.settings.getElephantPairing()).toBe("eotsang");
    });
  });

  when("they choose opposite asymmetric arrangements", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.hanSetup.setTo("Left Elephant");
      await janggi.settings.choSetup.setTo("Right Elephant");
    });

    then("the board says it is matsang", async ({janggi}) => {
      expect(await janggi.settings.getElephantPairing()).toBe("matsang");
    });

    then("nothing is barred by it — the game is playable as any other", async ({janggi}) => {
      expect(await janggi.status.getTurn()).toBe("cho");
      expect(await janggi.status.canPass()).toBe(true);
    });
  });

  when("either of them chose a symmetric arrangement", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.hanSetup.setTo("Left Elephant");
      await janggi.settings.choSetup.setTo("Inner Elephant");
    });

    then("there is no pairing to name, and no line saying so", async ({janggi}) => {
      expect(await janggi.settings.getElephantPairing()).toBeUndefined();
      expect(await janggi.settings.isElephantPairingShown()).toBe(false);
    });
  });
});

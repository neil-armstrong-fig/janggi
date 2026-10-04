import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import type {Janggi} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * A game against a friend is drawn with each half of the board in its owner's board, and each army in its owner's
 * pieces: the friend's half and army in the friend's own look, the player's own in theirs. A switch in the settings turns it off, for a player who would rather see
 * the game as they always do. Both were wearing something of their own before sitting down.
 *
 * What a board and a set look like is read the way every spec reads it — the surface and the writing the browser
 * resolves — and what the friend's looks like is read off their own device before the game, and compared.
 */
given("a player, and a friend who wears a board and a set of pieces of their own", () => {
  let hostsOwnSurface: string;
  let hostsOwnGeneral: string | undefined;
  let friendsOwnSurface: string;
  let friendsOwnGeneral: string | undefined;
  let diagramSurface: string;

  // The friend's device, opened afresh by every test's `beforeEach`, as Playwright runs every hook of a test anew.
  let friend: Janggi;

  beforeEach(async ({janggi}) => {
    friend = await janggi.openSeparateDevice();

    await janggi.settings.board.setTo("Classic");
    await janggi.settings.pieceSet.setTo("Hangul");
    await friend.settings.board.setTo("Neon");
    await friend.settings.pieceSet.setTo("Hanja");

    hostsOwnSurface = await janggi.board.getSurfaceAt(1);
    hostsOwnGeneral = await janggi.board.getCharacterAt(5, 2);
    friendsOwnSurface = await friend.board.getSurfaceAt(1);
    friendsOwnGeneral = await friend.board.getCharacterAt(5, 9);

    await friend.settings.board.setTo("Diagram");
    diagramSurface = await friend.board.getSurfaceAt(1);
    await friend.settings.board.setTo("Neon");

    await janggi.settings.account.signInWithGoogle();
    await friend.settings.account.signInWithGoogleAsAnotherPlayer();
  });

  when("the two play, the player as Han, with showing the opponent's board and pieces left on", () => {
    beforeEach(async ({janggi}) => {
      await playTogether(janggi, friend);
    });

    then("their friend's half of the board is drawn as their friend's board is", async ({janggi}) => {
      expect(friendsOwnSurface).not.toBe(hostsOwnSurface);
      expect(await janggi.board.getSurfaceAt(10)).toBe(friendsOwnSurface);
    });

    then("their own half of the board stays their own board", async ({janggi}) => {
      expect(await janggi.board.getSurfaceAt(1)).toBe(hostsOwnSurface);
    });

    then("their friend's army is in their friend's pieces", async ({janggi}) => {
      expect(await janggi.board.getCharacterAt(5, 9)).toBe(friendsOwnGeneral);
    });

    then("their own army stays in their own pieces", async ({janggi}) => {
      expect(await janggi.board.getCharacterAt(5, 2)).toBe(hostsOwnGeneral);
    });
  });

  when("their friend changes their board half way through the game", () => {
    beforeEach(async ({janggi}) => {
      await playTogether(janggi, friend);
      await friend.settings.board.setTo("Diagram");
    });

    then("their friend's half of the board follows to the board their friend chose", async ({janggi}) => {
      await expect.poll(() => janggi.board.getSurfaceAt(10)).toBe(diagramSurface);
    });
  });

  when("they have turned showing the opponent's board and pieces off, and the two play", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.opponentLook.setTo(false);
      await playTogether(janggi, friend);
    });

    then("both halves of the board stay as they have it", async ({janggi}) => {
      expect(await janggi.board.getSurfaceAt(1)).toBe(hostsOwnSurface);
      expect(await janggi.board.getSurfaceAt(10)).toBe(hostsOwnSurface);
    });

    then("their friend's army is in their own pieces too", async ({janggi}) => {
      expect(await janggi.board.getCharacterAt(5, 9)).not.toBe(friendsOwnGeneral);
    });
  });
});

/** The first player makes a code to play Han, the second types it in, and each chooses an arrangement. */
async function playTogether(host: Janggi, friend: Janggi): Promise<void> {
  await host.playAFriend.openPlayAFriend();
  await host.playAFriend.createACode("han");
  await expect.poll(() => host.playAFriend.getCode()).toBeDefined();
  const code = await host.playAFriend.getCode();
  if (code === undefined) throw new Error("The sheet showed no code");

  await friend.playAFriend.openPlayAFriend();
  await friend.playAFriend.joinWithCode(code);
  await host.playAFriend.chooseSetup("Inner Elephant");
  await friend.playAFriend.chooseSetup("Outer Elephant");
  await expect.poll(() => host.playAFriend.getState()).toBe("playing");
}

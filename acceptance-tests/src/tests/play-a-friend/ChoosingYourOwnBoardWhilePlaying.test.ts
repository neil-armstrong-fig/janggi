import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import type {Janggi} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * A board chosen in the settings is the board chosen, even half way through a game with a friend: the picker shows the
 * player's own choice and never the friend's, their own half is drawn as chosen, and with showing the opponent's board
 * turned off the whole board is. (With it on, the friend's half is still in the friend's board, which
 * `SeeingAFriendsBoard` covers.)
 */
given("a player in a game with a friend who wears a board of their own", () => {
  let diagramSurface: string;
  let friendsSurface: string;

  // The friend's device, opened afresh by every test's `beforeEach`, as Playwright runs every hook of a test anew.
  let friend: Janggi;

  beforeEach(async ({janggi}) => {
    friend = await janggi.openSeparateDevice();

    await janggi.settings.board.setTo("Diagram");
    diagramSurface = await janggi.board.getSurfaceAt(1);

    await janggi.settings.board.setTo("Classic");
    await friend.settings.board.setTo("Neon");
    friendsSurface = await friend.board.getSurfaceAt(1);

    await janggi.settings.account.signInWithGoogle();
    await friend.settings.account.signInWithGoogleAsAnotherPlayer();
  });

  when("they choose another board, with showing the opponent's board left on", () => {
    beforeEach(async ({janggi}) => {
      await playTogether(janggi, friend);
      await janggi.settings.board.setTo("Diagram");
    });

    then("the board they chose is the one shown as selected", async ({janggi}) => {
      expect(await janggi.settings.board.getSelected()).toBe("Diagram");
    });

    then("their own half is drawn in it", async ({janggi}) => {
      expect(await janggi.board.getSurfaceAt(1)).toBe(diagramSurface);
    });

    then("their friend's half stays in their friend's board", async ({janggi}) => {
      expect(await janggi.board.getSurfaceAt(10)).toBe(friendsSurface);
    });
  });

  when("they choose another board, with showing the opponent's board turned off", () => {
    beforeEach(async ({janggi}) => {
      await playTogether(janggi, friend);
      await janggi.settings.opponentLook.setTo(false);
      await janggi.settings.board.setTo("Diagram");
    });

    then("the board is drawn as they chose it", async ({janggi}) => {
      expect(await janggi.board.getSurfaceAt(1)).toBe(diagramSurface);
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

import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import type {Janggi} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * A game with a friend can take a while, so a player's own game — two people at the one device here, as the bot needs its
 * engine — goes on beside it: the Game tab says which of the two is on the board, and the other waits where it was. The
 * friend's game is the room's, and is played while it is out of sight: a move the friend makes meanwhile is there on the
 * return.
 *
 * `janggi` plays Han against `friend`, who as Cho moves first. In their own game the player moves the soldier on file 3; in
 * the one with the friend, the friend moves the soldier on file 1.
 */
given("a player in a game with a friend, and a game of their own", () => {
  let friend: Janggi;

  beforeEach(async ({janggi}) => {
    friend = await janggi.openSeparateDevice();

    await janggi.settings.account.signInWithGoogle();
    await friend.settings.account.signInWithGoogleAsAnotherPlayer();
    await playTogether(janggi, friend);
  });

  when("the player switches to their own game", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.games.switchTo("local");
    });

    then("the board shows their own game, at its start", async ({janggi}) => {
      expect(await janggi.settings.games.getShown()).toBe("local");
      expect(await janggi.board.getPieceAt(1, 7)).toEqual({side: "cho", type: "soldier"});
    });

    when("they play a move in it, and the friend plays one in theirs", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(3, 7);
        await janggi.board.tap(3, 6);
        await friend.board.tap(1, 7);
        await friend.board.tap(1, 6);
      });

      then("the player is told the game with their friend is waiting on them", async ({janggi}) => {
        await expect.poll(() => janggi.settings.games.isYourMoveWaiting()).toBe(true);
      });

      then("their own game keeps the move they played", async ({janggi}) => {
        expect(await janggi.board.getPieceAt(3, 6)).toEqual({side: "cho", type: "soldier"});
        expect(await janggi.board.getPieceAt(1, 6)).toBeUndefined();
      });

      when("they switch back to the game with their friend", () => {
        beforeEach(async ({janggi}) => {
          await expect.poll(() => janggi.settings.games.isYourMoveWaiting()).toBe(true);
          await janggi.settings.games.switchTo("friend");
        });

        then("the board shows the move their friend made while they were away", async ({janggi}) => {
          expect(await janggi.settings.games.getShown()).toBe("friend");
          expect(await janggi.board.getPieceAt(1, 6)).toEqual({side: "cho", type: "soldier"});
          expect(await janggi.board.getPieceAt(3, 6)).toBeUndefined();
        });
      });
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

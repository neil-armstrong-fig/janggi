import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import type {Janggi} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import type {FriendCode} from "@janggi/shared/janggi/online/friend-code/FriendCode";

/**
 * A friend's link needs an account, and a player who is not signed in is not signed in behind their back: the link
 * opens a prompt that offers to sign them in, and nothing is asked of the API until they say yes. Said yes, they come
 * back to the page through Google and are taken into the room the link named; said no, they have the game as it was.
 *
 * `janggi` is the player who makes the code, signed in, and `friend` is a second device that is not.
 */
given("a player who made a code, and a friend who is not signed in", () => {
  let friend: Janggi;

  beforeEach(async ({janggi}) => {
    friend = await janggi.openSeparateDevice();

    await janggi.settings.account.signInWithGoogle();
    await janggi.playAFriend.openPlayAFriend();
    await janggi.playAFriend.createACode("han");
  });

  when("the friend opens the link", () => {
    beforeEach(async ({janggi}) => {
      await friend.playAFriend.openTheLink(await codeOf(janggi));
    });

    then("the friend is asked to sign in to join", async () => {
      expect(await friend.playAFriend.isSignInPromptShown()).toBe(true);
    });

    when("they choose to sign in", () => {
      beforeEach(async () => {
        await friend.settings.account.signInAsAnotherPlayerFromThePrompt();
      });

      then("they are told who they are playing, with no code typed", async () => {
        await expect.poll(() => friend.playAFriend.getOpponentName()).toBe("Kim Yu-sin");
      });

      then("the prompt is gone", async () => {
        expect(await friend.playAFriend.isSignInPromptShown()).toBe(false);
      });
    });

    when("they dismiss it", () => {
      beforeEach(async () => {
        await friend.playAFriend.dismissTheSignInPrompt();
      });

      then("the prompt is gone", async () => {
        expect(await friend.playAFriend.isSignInPromptShown()).toBe(false);
      });

      then("they are still signed out", async () => {
        expect(await friend.settings.account.isSignInOffered()).toBe(true);
      });
    });
  });
});

given("a player who is not signed in", () => {
  when("they open a link to a friend's room", () => {
    beforeEach(async ({janggi}) => {
      await janggi.playAFriend.openTheLink("ABCD2345" as FriendCode);
    });

    then("they are asked to sign in to join", async ({janggi}) => {
      expect(await janggi.playAFriend.isSignInPromptShown()).toBe(true);
    });

    then("the game has made no call to the API", async ({janggi}) => {
      expect(await janggi.settings.account.getRequestsMadeToTheApi()).toBe(0);
    });
  });

  when("they open the game without a link", () => {
    then("they are not asked to sign in", async ({janggi}) => {
      expect(await janggi.playAFriend.isSignInPromptShown()).toBe(false);
    });
  });
});

async function codeOf(host: Janggi): Promise<FriendCode> {
  await expect.poll(() => host.playAFriend.getCode()).toBeDefined();

  const code = await host.playAFriend.getCode();
  if (code === undefined) throw new Error("The sheet showed no code");

  return code;
}

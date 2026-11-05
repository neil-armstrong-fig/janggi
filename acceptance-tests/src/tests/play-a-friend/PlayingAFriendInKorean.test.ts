import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import type {Janggi} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import type {FriendCode} from "@janggi/shared/janggi/online/friend-code/FriendCode";

/**
 * Playing a friend reads in Korean from the first sheet to the strip over the board: making a code, taking one, being
 * refused, the choice of setups, and the prompt a signed-out friend meets on opening a link.
 */
given("a player who reads the game in Korean and is signed in", () => {
  let friend: Janggi;

  beforeEach(async ({janggi}) => {
    friend = await janggi.openSeparateDevice();

    await janggi.settings.you.language.setTo("ko");
    await janggi.languageNotice.dismissIt();
    await friend.settings.you.language.setTo("ko");
    await friend.languageNotice.dismissIt();
    await janggi.settings.you.account.signInWithGoogle();
    await janggi.playAFriend.openPlayAFriend();
  });

  when("they open the sheet for playing a friend", () => {
    then("making a code and taking one are offered in Korean", async ({janggi}) => {
      const words = await janggi.playAFriend.getSheetWords();

      expect(words).toContain("코드 만들기");
      expect(words).toContain("코드를 입력해 방에 들어가기");
      expect(words).not.toContain("Make a code");
    });
  });

  when("they type a code no game has", () => {
    beforeEach(async ({janggi}) => {
      await janggi.playAFriend.joinWithCode("ZZZZ-ZZZZ");
    });

    then("they are told so in Korean", async ({janggi}) => {
      await expect.poll(() => janggi.playAFriend.getSheetWords()).toContain("그 코드의 대국이 없습니다");
    });
  });

  when("they make a code", () => {
    beforeEach(async ({janggi}) => {
      await janggi.playAFriend.createACode("han");
    });

    then("the wait for their friend is in Korean", async ({janggi}) => {
      await expect.poll(() => janggi.playAFriend.getStatusWords()).toBe("친구가 들어오기를 기다리는 중");
    });

    when("a friend who is signed out opens the link", () => {
      beforeEach(async ({janggi}) => {
        await friend.playAFriend.openTheLink(await codeOf(janggi));
      });

      then("the friend is asked to sign in, in Korean", async () => {
        const words = await friend.playAFriend.getSignInPromptWords();

        expect(words).toContain("친구 대국에 참여하려면 로그인하세요");
        expect(words).not.toContain("Sign in to join your friend");
      });
    });

    when("a friend joins and both come to choose their setups", () => {
      beforeEach(async ({janggi}) => {
        await friend.settings.you.account.signInWithGoogleAsAnotherPlayer();
        await friend.playAFriend.openPlayAFriend();
        await friend.playAFriend.joinWithCode(await codeOf(janggi));
      });

      then("each setup is named and described in Korean", async () => {
        await expect.poll(() => friend.playAFriend.getSheetWords()).toContain("안상차림");

        const words = await friend.playAFriend.getSheetWords();

        expect(words).toContain("가장 흔한 선택입니다");
        expect(words).not.toContain("Inner Elephant");
      });
    });
  });
});

async function codeOf(host: Janggi): Promise<FriendCode> {
  await expect.poll(() => host.playAFriend.getCode()).toBeDefined();

  const code = await host.playAFriend.getCode();
  if (code === undefined) throw new Error("The sheet showed no code");

  return code;
}

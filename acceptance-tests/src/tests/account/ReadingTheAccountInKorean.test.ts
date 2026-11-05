import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {saveKeyWith} from "@src/shared/share-keys/SaveKeyWith";

/**
 * A player who reads the game in Korean should find the You tab, and what comes of it, in Korean: the account, the
 * help links, the progress, the save key, and the toasts and answers the game gives. Janggi's own names stay as they are
 * written — XP, Google — and so do the style names, which are proper names.
 */
given("a player who reads the game in Korean", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.you.language.setTo("ko");
    await janggi.languageNotice.dismissIt();
  });

  when("they are signed out", () => {
    then("the account is explained in Korean, and offers the sign-in", async ({janggi}) => {
      const words = await janggi.settings.you.account.getAccountWords();

      expect(words).toContain("내 게임 동기화하기");
      expect(words).toContain("Google로 로그인");
      expect(words).not.toContain("Keep your game in sync");
      expect(words).not.toContain("Sign in with Google");
    });

    then("what signing in means for the legal pages is said in Korean, naming them as English", async ({janggi}) => {
      const words = await janggi.settings.you.account.getAccountWords();

      expect(words).toContain("이용약관(영어)");
      expect(words).toContain("개인정보처리방침(영어)");
    });

    then("the help links are in Korean", async ({janggi}) => {
      const words = await janggi.settings.you.getAppHelpWords();

      expect(words).toContain("장기 두는 법");
      expect(words).toContain("둘러보기 다시 보기");
      expect(words).toContain("참고 자료 및 출처");
      expect(words).toContain("개발자 웹사이트");
      expect(words).toContain("소스 코드");
      expect(words).not.toContain("How to play Janggi");
    });

    then("it says in Korean that everything is unlocked, as it is for every spec's player", async ({janggi}) => {
      expect(await janggi.settings.you.progress.getNextUnlockWords()).toBe("모든 것이 해금되었습니다.");
    });

    then("the version is named in Korean", async ({janggi}) => {
      expect(await janggi.settings.you.getAppHelpWords()).not.toContain("Version");
      expect(await janggi.settings.you.getVersionWords()).toContain("버전");
    });
  });

  when("they are starting from nothing", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.you.progress.loadSave(saveKeyWith({xp: 0}));
    });

    then("the next unlock is told in Korean, with its price in the way Korean writes numbers", async ({janggi}) => {
      expect(await janggi.settings.you.progress.getNextUnlockWords()).toMatch(/^다음 해금, 30 XP: /);
    });
  });

  when("they choose to play a friend online without signing in", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.play.games.chooseOnline();
    });

    then("the toast says why they were sent to the account, in Korean", async ({janggi}) => {
      expect(await janggi.toast.getWords()).toBe("친구와 온라인으로 두려면 로그인하세요.");
    });
  });

  when("they load a save key that is not one", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.you.progress.loadSave("not a save key");
    });

    then("they are told so in Korean", async ({janggi}) => {
      expect(await janggi.settings.you.progress.getSaveWords()).toBe("저장 키가 아닙니다.");
    });
  });

  when("they sign in", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.you.account.signInWithGoogle();
    });

    then("the account card is in Korean", async ({janggi}) => {
      const words = await janggi.settings.you.account.getAccountWords();

      expect(words).toContain("Google로 로그인됨");
      expect(words).toContain("로그아웃");
      expect(words).toContain("내 계정 삭제");
      expect(words).toContain("표시 이름");
    });

    then("it says in Korean that their progress is kept in step", async ({janggi}) => {
      await expect.poll(() => janggi.settings.you.account.getSyncWords()).toBe("진행 상황이 동기화되어 있습니다.");
    });

    when("they change their display name to a good one", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.you.account.renameTo("태극");
      });

      then("they are told it changed, in Korean", async ({janggi}) => {
        expect(await janggi.settings.you.account.getNameWords()).toBe("이름이 바뀌었습니다.");
      });
    });

    when("they try a name that cannot be one", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.you.account.renameTo("   ");
      });

      then("they are told why not, in Korean", async ({janggi}) => {
        expect(await janggi.settings.you.account.getNameWords()).toContain("이름은 1");
      });
    });
  });
});

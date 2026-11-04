import {DRAWN_BY} from "@janggi/shared/janggi/results/DrawnBy";
import {LANGUAGE_NAMES} from "@janggi/shared/janggi/settings/LanguageName";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";
import {expect, it} from "vitest";
import {messagesOf} from "@src/language/MessagesOf";

it("names every language in itself, the same in each, so a player can find theirs", () => {
  for (const language of LANGUAGE_NAMES) {
    expect(messagesOf(language).language.names).toEqual({en: "English", ko: "한국어"});
  }
});

it("says every ending of a game in every language, and never in the words of another", () => {
  for (const language of LANGUAGE_NAMES) {
    const {announcements, result} = messagesOf(language);

    for (const by of DRAWN_BY) {
      expect(announcements.drawn[by]).not.toBe("");
      expect(result.drawn[by]).not.toBe("");
    }

    for (const side of SIDES) {
      expect(announcements.won(side)).toContain(messagesOf(language).sides[side]);
    }
  }
});

it("reads in Korean without leaving English words in what it says of a turn", () => {
  const {announcements} = messagesOf("ko");

  expect(announcements.toMove("cho")).toBe("초 차례");
  expect(announcements.inCheck("han")).toBe("한 궁 장군 상태");
});

it("gives every step of the tour something to be called and something to say, in every language", () => {
  for (const language of LANGUAGE_NAMES) {
    const steps = Object.values(messagesOf(language).tour.steps(300));

    expect(steps.length).toBeGreaterThan(0);
    expect(steps.every(step => step.title !== "" && step.body !== "")).toBe(true);
  }
});

it("says what the style editor costs from the price the game charges, not a number of its own", () => {
  for (const language of LANGUAGE_NAMES) {
    expect(messagesOf(language).tour.steps(300).styles.body).toContain("300 XP");
  }
});

it("explains a called bikjang and a repeated position, whichever way the format settles it, in every language", () => {
  for (const language of LANGUAGE_NAMES) {
    const {result} = messagesOf(language);

    expect(result.bikjangExplanation("CALLER", true)).toContain("CALLER");
    expect(result.bikjangExplanation("CALLER", false)).toContain("CALLER");
    expect(result.bikjangExplanation("CALLER", true)).not.toBe(result.bikjangExplanation("CALLER", false));
    expect(result.repetitionExplanation(true)).not.toBe(result.repetitionExplanation(false));
  }
});

it("names the bot's army where the bot called the bikjang", () => {
  expect(messagesOf("ko").result.botPlaying("han")).toBe("봇(한)");
  expect(messagesOf("en").result.botPlaying("cho")).toContain("Cho");
});

it("tells a player about the Korean in both languages, so the one who needs it can read it", () => {
  expect(messagesOf("ko").translationNotice.body).toContain("한국어 번역은 아직 작업 중입니다");
  expect(messagesOf("en").translationNotice.body).toContain("The Korean translation is a work in progress");
});

it("writes numbers as each language does, so the XP of a player reads as theirs", () => {
  expect(messagesOf("en").locale).toBe("en");
  expect(messagesOf("ko").locale).toBe("ko");
});

it("tells what is next to unlock, and its price, in every language", () => {
  for (const language of LANGUAGE_NAMES) {
    const told = messagesOf(language).you.progress.nextUnlock("1,200", "Celadon theme");

    expect(told).toContain("1,200");
    expect(told).toContain("Celadon theme");
  }
});

it("says what a display name may be, and the longest it may be, in every language", () => {
  for (const language of LANGUAGE_NAMES) {
    expect(messagesOf(language).you.account.name.badLength(24)).toContain("24");
  }
});

it("says every state of syncing, and says each in its own words, in every language", () => {
  for (const language of LANGUAGE_NAMES) {
    const {idle, synced, paused, tooLarge} = messagesOf(language).you.account.sync;

    expect(new Set([idle, synced, paused, tooLarge]).size).toBe(4);
    expect([idle, synced, paused, tooLarge].every(words => words !== "")).toBe(true);
  }
});

it("says why a player was sent to sign in, in Korean without the English", () => {
  expect(messagesOf("ko").toasts.signInToPlayAFriend).toBe("친구와 온라인으로 두려면 로그인하세요.");
  expect(messagesOf("en").toasts.signInToPlayAFriend).toBe("Sign in to play a friend online.");
});

it("names the legal pages in Korean as being in English, since they are", () => {
  const {legal} = messagesOf("ko").you.account;

  expect(legal.firstLink).toContain("영어");
  expect(legal.secondLink).toContain("영어");
});

it("words a bot lock in each language around the same facts", () => {
  const lock = {beneath: 800, choice: "Cho", format: "Casual"} as const;

  expect(messagesOf("en").play.botLock(lock)).toBe("beat 800 as Cho in a casual game first");
  expect(messagesOf("ko").play.botLock(lock)).toBe("먼저 일반 대국에서 초 진영으로 800 봇을 이기세요");
});

it("asks for both armies where the side is random, in each language", () => {
  const lock = {beneath: 1000, choice: "Random", format: "Scored"} as const;

  expect(messagesOf("en").play.botLock(lock)).toBe("beat 1000 with both armies in a scored game first");
  expect(messagesOf("ko").play.botLock(lock)).toBe("먼저 점수제 대국에서 양쪽 진영으로 1000 봇을 이기세요");
});

it("names a soldier for its own army in Korean, where the two are written differently", () => {
  const {pieceName} = messagesOf("ko");

  expect(pieceName({side: "cho", type: "soldier"})).toBe("초 졸");
  expect(pieceName({side: "han", type: "soldier"})).toBe("한 병");
  expect(pieceName({side: "han", type: "general"})).toBe("한 궁");
});

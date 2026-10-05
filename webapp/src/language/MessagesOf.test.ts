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
  expect(announcements.inCheck("han")).toBe("한 장군");
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

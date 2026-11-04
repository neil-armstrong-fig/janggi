import {expect, it} from "vitest";
import {guideLinksOf} from "@src/react/pages/learn/links/GuideLinksOf";

it("leads from the English guide into the English game, and names the guide in each language", () => {
  expect(guideLinksOf("en", "/")).toEqual({
    game: "/",
    references: "/references.html",
    icon: "/icon.svg",
    guides: {en: "/learn.html", ko: "/ko/learn.html"},
  });
});

it("leads from the Korean guide into the Korean game and references, and names the same two guides", () => {
  expect(guideLinksOf("ko", "/")).toEqual({
    game: "/ko/",
    references: "/ko/references.html",
    icon: "/icon.svg",
    guides: {en: "/learn.html", ko: "/ko/learn.html"},
  });
});

it("keeps every link to where the app is served from", () => {
  const links = guideLinksOf("ko", "/janggi/");

  expect(links.references).toBe("/janggi/ko/references.html");
  expect(links.icon).toBe("/janggi/icon.svg");
  expect(links.game).toBe("/janggi/ko/");
  expect(links.guides).toEqual({en: "/janggi/learn.html", ko: "/janggi/ko/learn.html"});
});

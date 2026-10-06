// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {beforeEach, expect, it} from "vitest";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import {renderHook} from "@testing-library/react";
import {useLanguageAddress} from "@src/react/pages/game/hooks/use-language-address/UseLanguageAddress";

beforeEach(() => {
  globalThis.history.replaceState(undefined, "", "/");
});

it("moves a game read in Korean to the Korean page", () => {
  renderHook(() => useLanguageAddress("ko"));

  expect(globalThis.location.pathname).toBe("/ko/");
});

it("moves a game read in English back to the root", () => {
  globalThis.history.replaceState(undefined, "", "/ko/");

  renderHook(() => useLanguageAddress("en"));

  expect(globalThis.location.pathname).toBe("/");
});

it("leaves an address that already matches the language as it is", () => {
  globalThis.history.replaceState(undefined, "", "/ko/index.html");

  renderHook(() => useLanguageAddress("ko"));

  expect(globalThis.location.pathname).toBe("/ko/index.html");
});

it("keeps the query and the hash", () => {
  globalThis.history.replaceState(undefined, "", "/?join=ABCD#top");

  renderHook(() => useLanguageAddress("ko"));

  expect(globalThis.location.pathname + globalThis.location.search + globalThis.location.hash).toBe(
    "/ko/?join=ABCD#top",
  );
});

it("follows the language as it changes", () => {
  const {rerender} = renderHook(({language}) => useLanguageAddress(language), {
    initialProps: {language: "ko" as LanguageName},
  });

  rerender({language: "en"});

  expect(globalThis.location.pathname).toBe("/");
});

it("does not add a page to the history", () => {
  const before = globalThis.history.length;

  renderHook(() => useLanguageAddress("ko"));

  expect(globalThis.history.length).toBe(before);
});

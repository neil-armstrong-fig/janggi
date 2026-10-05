import {keptLanguage} from "@src/sw/notifying/KeptLanguage";
import {WORKER_LANGUAGE_CACHE} from "@src/language/notification/WorkerLanguageAddress";

const SCOPE = "https://janggi.example/";

function cachesHolding(text: string | undefined): Parameters<typeof keptLanguage>[0] {
  return {
    open: name =>
      Promise.resolve({
        match: request => {
          const found = name === WORKER_LANGUAGE_CACHE && request.href === `${SCOPE}worker-language`;
          if (!found || text === undefined) return Promise.resolve(undefined);

          return Promise.resolve({text: () => Promise.resolve(text)});
        },
      }),
  };
}

it("reads the language the page left", async () => {
  expect(await keptLanguage(cachesHolding("ko"), SCOPE)).toBe("ko");
});

it("is English where the page has left nothing", async () => {
  expect(await keptLanguage(cachesHolding(undefined), SCOPE)).toBe("en");
});

it("is English where what was left is not a language", async () => {
  expect(await keptLanguage(cachesHolding("fr"), SCOPE)).toBe("en");
});

it("is English where the caches cannot be opened", async () => {
  expect(await keptLanguage({open: () => Promise.reject(new Error("no storage"))}, SCOPE)).toBe("en");
});

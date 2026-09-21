import {ISOLATION_RELOAD_SPENT_KEY} from "@src/isolation/IsolationReloadSpentKey";
import {afterEach, expect, it, vi} from "vitest";
import {reloadMayStillCome} from "@src/isolation/ReloadMayStillCome";

afterEach(() => {
  vi.unstubAllGlobals();
});

it("may, on a first visit that a service worker can still take over", () => {
  stubPage({isolated: false, serviceWorker: true, reloaded: false});

  expect(reloadMayStillCome()).toBe(true);
});

it("may not once the page is isolated, there being nothing left to reload for", () => {
  stubPage({isolated: true, serviceWorker: true, reloaded: false});

  expect(reloadMayStillCome()).toBe(false);
});

it("may not in a browser with no service worker to take the page over", () => {
  stubPage({isolated: false, serviceWorker: false, reloaded: false});

  expect(reloadMayStillCome()).toBe(false);
});

it("may not once this session has already been reloaded for it, as after a hard refresh", () => {
  stubPage({isolated: false, serviceWorker: true, reloaded: true});

  expect(reloadMayStillCome()).toBe(false);
});

it("may not where the session cannot remember a reload, so that none is ever waited on in vain", () => {
  vi.stubGlobal("crossOriginIsolated", false);
  vi.stubGlobal("navigator", {serviceWorker: {}});
  vi.stubGlobal("sessionStorage", {
    getItem: () => {
      throw new Error("storage is blocked");
    },
  });

  expect(reloadMayStillCome()).toBe(false);
});

/** What the page is like, as far as `reloadMayStillCome` looks. */
interface PageState {
  readonly isolated: boolean;
  readonly serviceWorker: boolean;
  readonly reloaded: boolean;
}

function stubPage({isolated, serviceWorker, reloaded}: PageState): void {
  vi.stubGlobal("crossOriginIsolated", isolated);
  vi.stubGlobal("navigator", serviceWorker ? {serviceWorker: {}} : {});
  vi.stubGlobal("sessionStorage", {
    getItem: (key: string) => (reloaded && key === ISOLATION_RELOAD_SPENT_KEY ? "true" : null),
  });
}

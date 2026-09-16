// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {act, renderHook} from "@testing-library/react";
import {beforeEach, expect, it, vi} from "vitest";
import {useReleaseUpdate} from "@src/react/release-update/hooks/use-release-update/UseReleaseUpdate";

interface RegisterOptions {
  readonly immediate?: boolean;
  readonly onNeedReload?: () => void;
  readonly onRegisteredSW?: (scriptUrl: string, registration: ServiceWorkerRegistration | undefined) => void;
}

const pwa = vi.hoisted(() => ({
  needRefresh: false,
  options: undefined as RegisterOptions | undefined,
  updateServiceWorker: vi.fn<() => Promise<void>>(),
}));

const releaseChecks = vi.hoisted(() => ({
  watch: vi.fn<(registration: ServiceWorkerRegistration) => () => void>(),
}));

vi.mock(
  "@src/react/release-update/hooks/use-release-update/service-worker-registration/UseServiceWorkerRegistration",
  () => ({
    useServiceWorkerRegistration: (options: RegisterOptions) => {
      pwa.options = options;

      return {
        needRefresh: [pwa.needRefresh, vi.fn()],
        offlineReady: [false, vi.fn()],
        updateServiceWorker: pwa.updateServiceWorker,
      };
    },
  }),
);

vi.mock("@src/react/release-update/hooks/use-release-update/utils/WatchForRelease", () => ({
  watchForRelease: releaseChecks.watch,
}));

let addServiceWorkerListener: ReturnType<typeof vi.fn>;
let removeServiceWorkerListener: ReturnType<typeof vi.fn>;
let stopWatching: () => void;

beforeEach(() => {
  pwa.needRefresh = false;
  pwa.options = undefined;
  pwa.updateServiceWorker.mockReset().mockResolvedValue(undefined);

  stopWatching = vi.fn();
  releaseChecks.watch.mockReset().mockReturnValue(stopWatching);

  addServiceWorkerListener = vi.fn();
  removeServiceWorkerListener = vi.fn();
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: {
      addEventListener: addServiceWorkerListener,
      removeEventListener: removeServiceWorkerListener,
    },
  });
});

it("registers the service worker as soon as the page opens", () => {
  renderHook(() => useReleaseUpdate());

  expect(pwa.options?.immediate).toBe(true);
});

it("watches the registered worker for later releases until the page closes", () => {
  const rendered = renderHook(() => useReleaseUpdate());
  const registration = {} as ServiceWorkerRegistration;

  act(() => pwa.options?.onRegisteredSW?.("/ServiceWorker.js", registration));

  expect(releaseChecks.watch).toHaveBeenCalledWith(registration);

  rendered.unmount();
  expect(stopWatching).toHaveBeenCalledOnce();
});

it("offers a waiting release until the player leaves it for later", () => {
  pwa.needRefresh = true;
  const {result} = renderHook(() => useReleaseUpdate());

  expect(result.current.available).toBe(true);

  act(() => result.current.leaveUntilLater());
  expect(result.current.available).toBe(false);
});

it("asks the waiting worker to take over when the player refreshes", async () => {
  const {result} = renderHook(() => useReleaseUpdate());

  await act(async () => await result.current.refresh());

  expect(addServiceWorkerListener).toHaveBeenCalledWith("controllerchange", expect.any(Function), {once: true});
  expect(pwa.updateServiceWorker).toHaveBeenCalledOnce();
});

it("stops waiting to reload when the worker cannot take over", async () => {
  const failure = new Error("Update failed");
  pwa.updateServiceWorker.mockRejectedValue(failure);
  const {result} = renderHook(() => useReleaseUpdate());

  await expect(result.current.refresh()).rejects.toBe(failure);

  expect(removeServiceWorkerListener).toHaveBeenCalledWith("controllerchange", expect.any(Function));
});

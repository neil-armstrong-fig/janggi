// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {afterEach, beforeEach, expect, it, vi} from "vitest";
import {watchForRelease} from "@src/react/release-update/hooks/use-release-update/utils/WatchForRelease";

let online: boolean;
let registration: ServiceWorkerRegistration;
let stopWatching: () => void;
let update: ReturnType<typeof vi.fn<() => Promise<void>>>;

beforeEach(() => {
  vi.useFakeTimers();
  setVisibilityTo("visible");
  online = true;
  vi.spyOn(navigator, "onLine", "get").mockImplementation(() => online);

  update = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  registration = registeredWorker(update);
  stopWatching = watchForRelease(registration);
});

afterEach(() => {
  stopWatching();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it("checks for a release every hour while the app is open", async () => {
  await vi.advanceTimersByTimeAsync(60 * 60 * 1000);

  expect(update).toHaveBeenCalledOnce();
});

it("checks as soon as the app returns to the foreground", () => {
  setVisibilityTo("hidden");
  document.dispatchEvent(new Event("visibilitychange"));
  setVisibilityTo("visible");
  document.dispatchEvent(new Event("visibilitychange"));

  expect(update).toHaveBeenCalledOnce();
});

it("checks as soon as the device comes back online", () => {
  window.dispatchEvent(new Event("online"));

  expect(update).toHaveBeenCalledOnce();
});

it("does not check while the app is hidden", async () => {
  setVisibilityTo("hidden");

  await vi.advanceTimersByTimeAsync(60 * 60 * 1000);

  expect(update).not.toHaveBeenCalled();
});

it("does not check while the device is offline", async () => {
  online = false;

  await vi.advanceTimersByTimeAsync(60 * 60 * 1000);

  expect(update).not.toHaveBeenCalled();
});

it("does not check while another worker is installing", async () => {
  restartWatching({installing: worker()});

  await vi.advanceTimersByTimeAsync(60 * 60 * 1000);

  expect(update).not.toHaveBeenCalled();
});

it("does not check while another worker is waiting", async () => {
  restartWatching({waiting: worker()});

  await vi.advanceTimersByTimeAsync(60 * 60 * 1000);

  expect(update).not.toHaveBeenCalled();
});

it("tries again after a release check fails", async () => {
  update.mockRejectedValueOnce(new Error("Offline between checks"));

  await vi.advanceTimersByTimeAsync(2 * 60 * 60 * 1000);

  expect(update).toHaveBeenCalledTimes(2);
});

it("stops checking when the page closes", async () => {
  stopWatching();

  await vi.advanceTimersByTimeAsync(60 * 60 * 1000);
  document.dispatchEvent(new Event("visibilitychange"));
  window.dispatchEvent(new Event("online"));

  expect(update).not.toHaveBeenCalled();
});

interface WorkerState {
  readonly installing?: ServiceWorker;
  readonly waiting?: ServiceWorker;
}

function restartWatching(state: WorkerState): void {
  stopWatching();
  registration = registeredWorker(update, state);
  stopWatching = watchForRelease(registration);
}

function registeredWorker(updateWorker: () => Promise<void>, state: WorkerState = {}): ServiceWorkerRegistration {
  return {
    installing: state.installing ?? null,
    waiting: state.waiting ?? null,
    update: updateWorker,
  } as unknown as ServiceWorkerRegistration;
}

function worker(): ServiceWorker {
  return {} as ServiceWorker;
}

function setVisibilityTo(state: DocumentVisibilityState): void {
  Object.defineProperty(document, "visibilityState", {configurable: true, value: state});
}

import {showTheApp} from "@src/sw/notifying/ShowTheApp";
import {vi} from "vitest";

it("focuses the window the app is open in", async () => {
  const focus = vi.fn(() => Promise.resolve());
  const openWindow = vi.fn(() => Promise.resolve());

  await showTheApp({matchAll: () => Promise.resolve([{focus}]), openWindow}, "https://janggi.example/");

  expect(focus).toHaveBeenCalledOnce();
  expect(openWindow).not.toHaveBeenCalled();
});

it("opens the app where it is not open", async () => {
  const openWindow = vi.fn(() => Promise.resolve());

  await showTheApp({matchAll: () => Promise.resolve([]), openWindow}, "https://janggi.example/");

  expect(openWindow).toHaveBeenCalledWith("https://janggi.example/");
});

it("looks among the windows the worker does not control as well, since the app may have been opened before it", async () => {
  const matchAll = vi.fn(() => Promise.resolve([]));

  await showTheApp({matchAll, openWindow: () => Promise.resolve()}, "https://janggi.example/");

  expect(matchAll).toHaveBeenCalledWith({type: "window", includeUncontrolled: true});
});

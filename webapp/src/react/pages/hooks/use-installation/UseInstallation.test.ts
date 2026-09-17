// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {act, renderHook} from "@testing-library/react";
import {expect, it, vi} from "vitest";
import {useInstallation} from "@src/react/pages/hooks/use-installation/UseInstallation";

interface InstallPromptEvent extends Event {
  readonly userChoice: Promise<InstallChoice>;
  prompt(): Promise<void>;
}

interface InstallChoice {
  readonly outcome: "accepted" | "dismissed";
  readonly platform: string;
}

it("offers installation only while the browser has an install prompt", () => {
  const {result} = renderHook(() => useInstallation());

  expect(result.current.canInstall).toBe(false);

  act(() => globalThis.dispatchEvent(installPromptWith(vi.fn())));
  expect(result.current.canInstall).toBe(true);

  act(() => globalThis.dispatchEvent(new Event("appinstalled")));
  expect(result.current.canInstall).toBe(false);
});

it("starts the browser's prompt and consumes it when installation is chosen", async () => {
  const prompt = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const {result} = renderHook(() => useInstallation());
  act(() => globalThis.dispatchEvent(installPromptWith(prompt)));

  await act(async () => await result.current.offerInstallation());

  expect(prompt).toHaveBeenCalledOnce();
  expect(result.current.canInstall).toBe(false);
});

function installPromptWith(prompt: () => Promise<void>): InstallPromptEvent {
  const event = new Event("beforeinstallprompt", {cancelable: true});
  Object.defineProperties(event, {
    prompt: {value: prompt},
    userChoice: {value: Promise.resolve({outcome: "accepted", platform: "web"})},
  });

  return event as InstallPromptEvent;
}

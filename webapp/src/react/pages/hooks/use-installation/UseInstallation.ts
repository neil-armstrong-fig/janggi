import {useSyncExternalStore} from "react";

interface InstallChoice {
  readonly outcome: "accepted" | "dismissed";
  readonly platform: string;
}

interface InstallPromptEvent extends Event {
  readonly userChoice: Promise<InstallChoice>;
  prompt(): Promise<void>;
}

interface Installation {
  readonly canInstall: boolean;
  readonly offerInstallation: () => Promise<void>;
}

type PromptListener = () => void;

let installPrompt: InstallPromptEvent | undefined;
const promptListeners = new Set<PromptListener>();

export function useInstallation(): Installation {
  const prompt = useSyncExternalStore(subscribe, currentPrompt, noPrompt);

  return {canInstall: prompt !== undefined, offerInstallation};
}

function subscribe(promptListener: PromptListener): () => void {
  promptListeners.add(promptListener);
  if (promptListeners.size === 1) {
    globalThis.addEventListener("beforeinstallprompt", rememberInstallPrompt);
    globalThis.addEventListener("appinstalled", installationFinished);
  }

  return removePromptListener.bind(undefined, promptListener);
}

function removePromptListener(promptListener: PromptListener): void {
  promptListeners.delete(promptListener);
  if (promptListeners.size !== 0) return;

  globalThis.removeEventListener("beforeinstallprompt", rememberInstallPrompt);
  globalThis.removeEventListener("appinstalled", installationFinished);
}

function rememberInstallPrompt(event: Event): void {
  event.preventDefault();
  installPrompt = event as InstallPromptEvent;
  notifyPromptListeners();
}

function installationFinished(): void {
  installPrompt = undefined;
  notifyPromptListeners();
}

function currentPrompt(): InstallPromptEvent | undefined {
  return installPrompt;
}

function noPrompt(): undefined {
  return undefined;
}

async function offerInstallation(): Promise<void> {
  const offeredPrompt = installPrompt;
  if (!offeredPrompt) return;

  installPrompt = undefined;
  notifyPromptListeners();
  await offeredPrompt.prompt();
  await offeredPrompt.userChoice;
}

function notifyPromptListeners(): void {
  for (const promptListener of promptListeners) promptListener();
}

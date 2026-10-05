import type {AppWindows} from "@src/sw/notifying/types/AppWindows";

/**
 * Brings the app to the front for a tap on a notification: a window that is open is focused, and where none is the app is opened at
 * `scope`. The page finds its room by itself, from the code it kept, so nothing is carried in the address.
 */
export async function showTheApp(windows: AppWindows, scope: string): Promise<void> {
  const open = (await windows.matchAll({type: "window", includeUncontrolled: true}))[0];

  if (open) {
    await open.focus();
    return;
  }

  await windows.openWindow(scope);
}

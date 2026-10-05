/** One open window of the app, which may be brought to the front. */
export interface AppWindow {
  readonly focus: () => Promise<unknown>;
}

/** The windows of the app a worker can reach, and the means to open one. */
export interface AppWindows {
  readonly matchAll: (options: {type: "window"; includeUncontrolled: boolean}) => Promise<readonly AppWindow[]>;
  readonly openWindow: (url: string) => Promise<unknown>;
}

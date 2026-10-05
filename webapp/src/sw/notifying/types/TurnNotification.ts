/** What a notification says, as the worker hands it to the browser to show. */
export interface TurnNotification {
  readonly title: string;
  readonly options: TurnNotificationOptions;
}

/** The parts of a notification's options this worker sets; the browser knows more, and the `DOM` lib is not in a worker's program. */
export interface TurnNotificationOptions {
  readonly body: string;
  /** A later notification with the same tag replaces an earlier one still showing, so a friend's two quick moves are one notification. */
  readonly tag: string;
  /** Sounds and buzzes again for a notification that replaces another, which would otherwise arrive silently. */
  readonly renotify: boolean;
  readonly icon: string;
}

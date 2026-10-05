/**
 * Where a device stands on being told, by a notification, that it is its player's turn, as the page says it and a spec asserts it:
 * still finding out; not possible in this browser (it has no push, or the app is not installed where the browser needs it to be);
 * refused by the player in the browser's own settings; possible and off; or on.
 */
export const TURN_NOTIFICATIONS_STATES = ["checking", "unavailable", "blocked", "off", "on"] as const;

export type TurnNotificationsState = (typeof TURN_NOTIFICATIONS_STATES)[number];

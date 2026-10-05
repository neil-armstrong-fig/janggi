/**
 * The tabs the settings sheet is divided into, one pane showing at a time. These are ids: a spec says
 * which tab it means by them, and the sheet draws each with a picture over its English name. They stay
 * as they are if the name a player reads is ever translated.
 */
export const SETTINGS_TAB_NAMES = ["Play", "Look", "Sound", "You"] as const;

export type SettingsTabName = (typeof SETTINGS_TAB_NAMES)[number];

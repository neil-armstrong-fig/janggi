/**
 * The tabs the settings sheet is divided into, one pane showing at a time. Named by the label a player
 * reads on the tab, so a spec says which tab it means the way a player would.
 */
export const SETTINGS_TAB_NAMES = ["Game", "Look", "Sound", "Progress"] as const;

export type SettingsTabName = (typeof SETTINGS_TAB_NAMES)[number];

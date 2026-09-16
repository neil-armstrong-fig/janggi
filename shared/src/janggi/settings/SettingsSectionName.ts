/**
 * The sections the settings sheet is divided into, each of which a player may fold away. Named by the
 * heading a player reads over it, so a spec says which section it means the way a player would.
 */
export const SETTINGS_SECTION_NAMES = ["This game", "Appearance", "Sound & effects", "Progress"] as const;

export type SettingsSectionName = (typeof SETTINGS_SECTION_NAMES)[number];

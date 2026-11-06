import type {SettingsMessages} from "@src/language/settings/settings-messages/SettingsMessages";

/** The settings sheet, in English. */
export const ENGLISH_SETTINGS_MESSAGES: SettingsMessages = {
  closeLabel: "Close settings",
  tabsLabel: "Kinds of setting",
  notYetChosen: "Not yet chosen",
  back: "Back",
  whatEachMeans: label => `What each ${label.toLowerCase()} means`,
  whatItMeans: label => `What "${label}" means`,
};

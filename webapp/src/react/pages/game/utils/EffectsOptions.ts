import type {Effects} from "@src/react/pages/game/types/Effects";

const full: Effects = {name: "Full", full: true};
const reduced: Effects = {name: "Reduced", full: false};

/**
 * The two settings for how much the board moves. Which one a player starts with is the store's to say
 * — `PreferencesSlice` — and it is full, whatever the device has asked for.
 */
export const EFFECTS: readonly Effects[] = [full, reduced];

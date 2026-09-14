import type {MovableHighlight} from "@src/react/pages/game/types/MovableHighlight";

const shown: MovableHighlight = {name: "Shown", shown: true};
const hidden: MovableHighlight = {name: "Hidden", shown: false};

/**
 * The two settings for the movable-piece mark. Which one a player starts with is the store's to say —
 * `PreferencesSlice` — since that is where the choice is held.
 */
export const MOVABLE_HIGHLIGHTS: readonly MovableHighlight[] = [shown, hidden];

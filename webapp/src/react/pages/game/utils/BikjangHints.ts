import type {BikjangHint} from "@src/react/pages/game/types/BikjangHint";

const shown: BikjangHint = {name: "Shown", shown: true};
const hidden: BikjangHint = {name: "Hidden", shown: false};

/**
 * The two settings for the bikjang hint. Which one a player starts with is the store's to say —
 * `PreferencesSlice` — since that is where the choice is held.
 */
export const BIKJANG_HINTS: readonly BikjangHint[] = [shown, hidden];

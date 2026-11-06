import type {TutorialProgress} from "@src/redux/tutorial/types/TutorialProgress";

/** How far a player has come who has never started the tutorial. */
export const NOT_STARTED: TutorialProgress = {reached: 0, completed: false};

/**
 * The guided tutorial's scenes, in the order they are played: a whole game through to 외통, then a short scene for each
 * other way a game ends. The words a player reads for each are looked up by this name, in every language.
 */
export const TUTORIAL_SCENE_NAMES = [
  "the-whole-game",
  "a-bikjang",
  "a-repetition",
  "resting-turns",
  "an-agreement",
] as const;

export type TutorialSceneName = (typeof TUTORIAL_SCENE_NAMES)[number];

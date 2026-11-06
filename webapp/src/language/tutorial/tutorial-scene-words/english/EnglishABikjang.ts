import type {TutorialSceneWords} from "@src/language/tutorial/tutorial-scene-words/TutorialSceneWords";

/** What the card says through the tutorial's bikjang scene (`A_BIKJANG`, in `react/pages/game/tutorial/scenes/`), in English. */
export const ENGLISH_A_BIKJANG: TutorialSceneWords = {
  name: "빅장 · Bikjang",
  steps: [
    {
      title: "Generals face to face",
      body: "Only a few pieces are left in this scene. Han's guard is all that stands between the two generals on the middle line. Step your soldier forward, and watch Han's answer.",
    },
    {title: "Han's guard steps aside", body: "Han's guard steps aside."},
    {
      title: "빅장: call it",
      body: "Han's guard stepped aside, and now nothing stands between the generals: that is 빅장 (bikjang). The player to move may call it, which ends the game. Press Bikjang.",
    },
  ],
  ending: {
    title: "빅장: a draw",
    body: "In a casual game a called bikjang is a draw. In a scored game it is counted on points instead, and may only be called while each side has under 30 points.",
  },
};

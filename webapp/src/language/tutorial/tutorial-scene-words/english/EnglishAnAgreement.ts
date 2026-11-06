import type {TutorialSceneWords} from "@src/language/tutorial/tutorial-scene-words/TutorialSceneWords";

/** What the card says through the tutorial's agreed draw scene (`AN_AGREEMENT`, in `react/pages/game/tutorial/scenes/`), in English. */
export const ENGLISH_AN_AGREEMENT: TutorialSceneWords = {
  name: "합의 · Agreement",
  steps: [
    {
      title: "Offer a draw",
      body: "In a casual game the players may simply agree to stop, with a draw. Press Draw: Han will accept.",
    },
  ],
  ending: {
    title: "합의: a draw",
    body: "Han accepted, so the game is drawn. A scored game has no draw to agree: two players who want to stop each rest a turn, and the points decide.",
  },
};

import type {TutorialSceneWords} from "@src/language/tutorial/tutorial-scene-words/TutorialSceneWords";

/** What the card says through the tutorial's repetition scene (`A_REPETITION`, in `react/pages/game/tutorial/scenes/`), in English. */
export const ENGLISH_A_REPETITION: TutorialSceneWords = {
  name: "반복수 · Repetition",
  steps: [
    {title: "Han moves its chariot", body: "Han's chariot moves down a point."},
    {
      title: "Going round in circles",
      body: "Both armies have plenty left here: 33 points of pieces each. Han moved its chariot; move yours up a point.",
    },
    {title: "Han goes back", body: "Han's chariot goes back."},
    {
      title: "And back",
      body: "Han's chariot went back. Move yours back too: the board then stands as it started, for the second time.",
    },
    {title: "Han goes round again", body: "Han's chariot goes round again."},
    {title: "Round again", body: "Han is going round again. Follow it once more."},
    {title: "Han goes back", body: "Han's chariot goes back."},
    {
      title: "No third time",
      body: "Han went back. Going back now would make the board stand as it started for a third time, and with 30 points or more on a side that is not allowed: the note over the board says so, and the point it would go back to is marked. Move your chariot up the line instead.",
    },
  ],
  ending: {
    title: "반복수: no third time",
    body: "With 30 points of pieces or more on a side, the same position may not stand a third time, so the game goes on and someone has to play something new. With each side under 30, the third time is allowed, and it ends the game instead: a draw in a casual game, counted on points in a scored one.",
  },
};

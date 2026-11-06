import type {TutorialSceneWords} from "@src/language/tutorial/tutorial-scene-words/TutorialSceneWords";

/** What the card says through the tutorial's resting turns scene (`RESTING_TURNS`, in `react/pages/game/tutorial/scenes/`), in English. */
export const ENGLISH_RESTING_TURNS: TutorialSceneWords = {
  name: "한수쉼 · Resting a turn",
  steps: [
    {
      title: "Rest a turn",
      body: "Instead of moving, a player may rest a turn (한수쉼), so long as they are not in check. You are well ahead here. Press Pass.",
    },
    {title: "Han rests too", body: "Han rests its turn too."},
  ],
  ending: {
    title: "점수: Cho wins on points",
    body: "Two turns rested in a row end the game, and the points decide it. Each piece left counts: chariot 13, cannon 7, horse 5, elephant 3, guard 3, soldier 2, and Han has 1.5 more (덤) for moving second. Here Cho has 20 and Han 6.5.",
  },
};

import {ENGLISH_GUIDED_GAME_WORDS} from "@src/language/tutorial/entry-words/english/EnglishGuidedGameWords";
import type {TutorialMessages} from "@src/language/tutorial/tutorial-messages/TutorialMessages";
import {ENGLISH_AN_AGREEMENT} from "@src/language/tutorial/tutorial-scene-words/english/EnglishAnAgreement";
import {ENGLISH_A_BIKJANG} from "@src/language/tutorial/tutorial-scene-words/english/EnglishABikjang";
import {ENGLISH_A_REPETITION} from "@src/language/tutorial/tutorial-scene-words/english/EnglishARepetition";
import {ENGLISH_RESTING_TURNS} from "@src/language/tutorial/tutorial-scene-words/english/EnglishRestingTurns";
import {ENGLISH_THE_WHOLE_GAME} from "@src/language/tutorial/tutorial-scene-words/english/EnglishTheWholeGame";

/**
 * The guided tutorial in English. A scene's name and a title give janggi's own term first, since that is the word used
 * over the board. A scene's steps are in the order its script plays them (`react/pages/game/tutorial/scenes/`).
 */
export const ENGLISH_TUTORIAL_MESSAGES: TutorialMessages = {
  scenes: {
    "the-whole-game": ENGLISH_THE_WHOLE_GAME,
    "a-bikjang": ENGLISH_A_BIKJANG,
    "a-repetition": ENGLISH_A_REPETITION,
    "resting-turns": ENGLISH_RESTING_TURNS,
    "an-agreement": ENGLISH_AN_AGREEMENT,
  },
  closing: {
    name: "시간패 · Time",
    narration: {
      title: "시간패: out of time",
      body: "One more ending, which the guided game can only tell you about: on a clock, a player whose time runs out loses (시간패), whatever is on the board. The tutorial has no clock; you can turn one on in the Play tab. That's the guided game. Finish it to go back to your own game.",
    },
  },
  card: {
    label: "Guided game",
    stepOf: (sceneName, step) => `${sceneName} · step ${step}`,
    over: sceneName => `${sceneName} · over`,
    hide: "Hide",
    show: "Show",
    leave: "Leave the guided game",
    finish: "Finish",
    answering: "Han is answering…",
    next: sceneName => `Next: ${sceneName}`,
  },
  you: {
    ...ENGLISH_GUIDED_GAME_WORDS,
    aGuidedGame: "A guided game",
    sceneOf: (scene, count) => `Scene ${scene} of ${count}`,
    afterYourGame: "After your rated or friend game",
    startOver: "Start the guided game over",
  },
  holdsPlay:
    "The tutorial has the board. Leave it to choose an opponent, a format or setups, or to start a game of your own.",
};

import {ENGLISH_GUIDED_GAME_WORDS} from "@src/language/tutorial/entry-words/english/EnglishGuidedGameWords";
import type {WelcomeMessages} from "@src/language/onboarding/welcome-messages/WelcomeMessages";

/** The welcome a first visit opens on, in English. */
export const ENGLISH_WELCOME_MESSAGES: WelcomeMessages = {
  title: "Welcome to Janggi",
  aboutTheGame:
    "Janggi is Korean chess. Two armies, Cho and Han, trade blows across the board, and whoever checkmates the opposing general wins.",
  aboutThisDevice:
    "You start against a gentle bot, and you do not need an account. Everything you set is kept on this device.",
  next: "Next",
  choicesTitle: "Set it up your way",
  music: "Music",
  soundEffects: "Sound effects",
  animations: "Animations",
  showWhereAPieceCanMove: "Show where a piece can move",
  answers: {On: "On", Off: "Off", Full: "Full", Reduced: "Reduced", Shown: "Shown", Hidden: "Hidden"},
  changeAnyTime: "You can change all of these any time in Settings.",
  takeTheTour: "Take the quick tour",
  startTheTutorial: ENGLISH_GUIDED_GAME_WORDS.offers.start,
  skip: "Skip, just play",
};

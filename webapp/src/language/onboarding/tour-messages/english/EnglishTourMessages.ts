import type {TourMessages} from "@src/language/onboarding/tour-messages/TourMessages";

/** The quick tour, in English. */
export const ENGLISH_TOUR_MESSAGES: TourMessages = {
  steps: styleEditorXp => ({
    "pick-up": {title: "Pick up a piece", body: "Tap one of your pieces to see everywhere it can go."},
    move: {
      title: "Make a move",
      body: "Tap a highlighted point to move there. Sliding a soldier sideways is a solid way to open.",
    },
    controls: {
      title: "The controls",
      body: "Under the board, Pass rests your turn, Bikjang calls the generals' face-off, and Draw offers a draw. Undo and Redo take a move back. They are switched off against the bot and are for games between two people.",
    },
    settings: {
      title: "Settings",
      body: "Everything else lives in Settings: how the game is played, how it looks, how it sounds, and your progress. Tap it to open.",
    },
    xp: {
      title: "Earn XP",
      body: "Playing earns XP, and XP unlocks new boards, new pieces and stronger bots.",
    },
    styles: {
      title: "Make it your own",
      body: `At ${styleEditorXp} XP you can design your own board and pieces. Styles other players share are free to import.`,
    },
    account: {
      title: "Keep it in sync",
      body: "Signing in with Google is optional: skip it any time and Janggi plays the same. It keeps your XP, unlocks and styles in step across your devices, and it is the only way to play a friend online, so sign in first if you want to.",
    },
    friend: {
      title: "Play a friend",
      body: "Tap Online to make a code and send it to a friend, or to enter theirs, and play each other live. You both need to be signed in.",
    },
    guide: {
      title: "New to Janggi?",
      body: "Try a guided game to learn by playing, or read the guide for every piece and the rules. The moves you made on this tour were practice; your own board is waiting for you.",
    },
  }),
  card: "Quick tour",
  stepOf: (step, count) => `Step ${step} of ${count}`,
  openTheGuide: "Open the guide",
  skip: "Skip tour",
  back: "Back",
  next: "Next",
  finish: "Finish",
};

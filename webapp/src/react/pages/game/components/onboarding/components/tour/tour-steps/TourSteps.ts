import type {TourStep} from "@src/react/pages/game/components/onboarding/components/tour/types/TourStep";
import type {TourStepName} from "@src/redux/onboarding/touring/TourStepName";
import {UNLOCK_PRICES} from "@src/redux/progress/unlocks/UnlockPrices";

/**
 * What the tour says at each of its steps, and what it does to the page as it says it. A record over the
 * store's step names, so a step added there and not here does not compile.
 *
 * The first two are taught by doing — the player picks up a piece and moves it, for real — and the
 * settings step by opening them. The two after it are shown inside the sheet, each on the tab that keeps
 * what it is about, and the last puts the sheet away and sends them to the guide.
 */
export const TOUR_STEPS: Readonly<Record<TourStepName, TourStep>> = {
  "pick-up": {
    title: "Pick up a piece",
    body: "Tap one of your pieces to see everywhere it can go.",
    target: "point",
    sheet: "closed",
    advance: "tap",
  },
  move: {
    title: "Make a move",
    body: "Tap a highlighted point to move there. Sliding a soldier sideways is a solid way to open.",
    target: "point",
    sheet: "closed",
    advance: "move",
  },
  controls: {
    title: "The controls",
    body: "Under the board, Pass rests your turn, Bikjang calls the generals' face-off, and Draw offers a draw. Undo and Redo take a move back, but they are switched off against the bot — they are for games between two people.",
    target: "controls",
    sheet: "closed",
  },
  settings: {
    title: "Settings",
    body: "Everything else lives in Settings: how the game is played, how it looks, how it sounds, and your progress. Tap it to open.",
    target: "settings",
    sheet: "closed",
    advance: "tap",
  },
  xp: {
    title: "Earn XP",
    body: "Playing earns XP, and XP unlocks new boards, new pieces and stronger bots.",
    target: "xp",
    sheet: "Progress",
  },
  styles: {
    title: "Make it your own",
    body: `At ${UNLOCK_PRICES.styleEditor} XP you can design your own board and pieces. Styles other players share are free to import.`,
    target: "styles",
    sheet: "Look",
  },
  guide: {
    title: "New to Janggi?",
    body: "The guide teaches every piece and the rules in about five minutes. It is well worth it before your first real game.",
    sheet: "closed",
    offersTheGuide: true,
  },
};

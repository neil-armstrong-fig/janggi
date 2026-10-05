import type {TourStep} from "@src/react/pages/game/components/onboarding/components/tour/types/TourStep";
import type {TourStepName} from "@janggi/shared/janggi/onboarding/TourStepName";

/**
 * What the tour does to the page at each of its steps — what it points at, where the sheet goes, what moves it on. What it
 * says is `Messages.tour`, in the language the game is read in. A record over the
 * store's step names, so a step added there and not here does not compile.
 *
 * The first two are taught by doing — the player picks up a piece and moves it, for real — and the
 * settings step by opening them. The two after it are shown inside the sheet, each on the tab that keeps
 * what it is about, and the last puts the sheet away and sends them to the guide.
 */
export const TOUR_STEPS: Readonly<Record<TourStepName, TourStep>> = {
  "pick-up": {
    target: "point",
    sheet: "closed",
    advance: "tap",
  },
  move: {
    target: "point",
    sheet: "closed",
    advance: "move",
  },
  controls: {
    target: "controls",
    sheet: "closed",
  },
  settings: {
    target: "settings",
    sheet: "closed",
    advance: "tap",
  },
  xp: {
    target: "xp",
    sheet: "You",
  },
  styles: {
    target: "styles",
    sheet: "Look",
  },
  account: {
    target: "account",
    sheet: "You",
  },
  friend: {
    target: "friend",
    sheet: "Play",
    needsSignIn: true,
  },
  guide: {
    sheet: "closed",
    offersTheGuide: true,
  },
};

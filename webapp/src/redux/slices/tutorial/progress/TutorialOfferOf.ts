import type {TutorialOffer} from "@janggi/shared/janggi/tutorial/TutorialOffer";
import type {TutorialProgress} from "@src/redux/slices/tutorial/types/TutorialProgress";

/**
 * What the game offers of the tutorial, by how far the player has come: to resume it where they came part way, to play
 * it again once done, and otherwise to start it. Resuming outranks playing again, for a player part way through a second time.
 */
export function tutorialOfferOf({reached, completed}: TutorialProgress): TutorialOffer {
  if (reached > 0) return "resume";

  if (completed) return "again";

  return "start";
}

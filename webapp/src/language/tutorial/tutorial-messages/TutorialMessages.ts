import type {TutorialSceneName} from "@janggi/shared/janggi/tutorial/TutorialSceneName";
import type {TutorialSceneWords} from "@src/language/tutorial/tutorial-scene-words/TutorialSceneWords";
import type {TutorialNarrationWords} from "@src/language/tutorial/types/TutorialNarrationWords";
import type {TutorialOffer} from "@janggi/shared/janggi/tutorial/TutorialOffer";

/** The guided tutorial: every scene's words, the closing card's, the card's own, and the ways in to it. */
export interface TutorialMessages {
  readonly scenes: Record<TutorialSceneName, TutorialSceneWords>;
  readonly closing: TutorialClosingWords;
  readonly card: TutorialCardMessages;
  readonly you: TutorialOfferMessages;
  /** What the Play tab says in place of its settings while the tutorial has the board, each of which would deal a game. */
  readonly holdsPlay: string;
}

/** The tutorial card's own words, around what a step says. */
interface TutorialCardMessages {
  /** What a screen reader calls the card. */
  readonly label: string;
  /** The line over a step's title: the scene, and which step of it. */
  readonly stepOf: (sceneName: string, step: number) => string;
  /** The line over a scene's ending. */
  readonly over: (sceneName: string) => string;
  readonly hide: string;
  readonly show: string;
  readonly leave: string;
  readonly finish: string;
  /** Said while the other army's scripted move is coming. */
  readonly answering: string;
  /** The button on to what follows a scene: the next scene, or the closing card. */
  readonly next: (sceneName: string) => string;
}

/**
 * The card after the tutorial's last scene, which tells of the one ending it has no clock to show: time running out
 * (시간패).
 */
interface TutorialClosingWords {
  /** What the card calls it, as a scene's name is called. */
  readonly name: string;
  readonly narration: TutorialNarrationWords;
}

/** The ways into the guided game: what it offers, and what it says under that. */
interface TutorialOfferMessages {
  readonly name: string;
  readonly offers: Record<TutorialOffer, string>;
  /** Under a start, or a start again. */
  readonly aGuidedGame: string;
  /** Under a resume: the scene it resumes from, of how many. */
  readonly sceneOf: (scene: number, count: number) => string;
  /** Under a button switched off, while a rated game or a friend's has the board. */
  readonly afterYourGame: string;
  readonly startOver: string;
}

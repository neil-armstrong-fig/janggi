import type {EffectsName} from "@janggi/shared/janggi/settings/EffectsName";
import type {MovableHighlightName} from "@janggi/shared/janggi/settings/MovableHighlightName";
import type {SoundChoiceName} from "@janggi/shared/janggi/onboarding/SoundChoiceName";

/** The welcome a first visit opens on: what the game is, then four choices worth making before the first tap. */
export interface WelcomeMessages {
  readonly title: string;
  readonly aboutTheGame: string;
  readonly aboutThisDevice: string;
  readonly next: string;
  readonly choicesTitle: string;
  readonly music: string;
  readonly soundEffects: string;
  readonly animations: string;
  readonly showWhereAPieceCanMove: string;
  readonly answers: Record<WelcomeAnswer, string>;
  readonly changeAnyTime: string;
  readonly takeTheTour: string;
  /** The choice beside the tour of playing the guided tutorial instead. */
  readonly startTheTutorial: string;
  readonly skip: string;
}

/** Every button the welcome's choices offer, by the name it has in the code. */
type WelcomeAnswer = SoundChoiceName | EffectsName | MovableHighlightName;

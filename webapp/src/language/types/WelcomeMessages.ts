import type {WelcomeAnswer} from "@src/language/types/WelcomeAnswer";

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
  readonly skip: string;
}

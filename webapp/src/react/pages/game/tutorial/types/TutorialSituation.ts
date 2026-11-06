import type {TutorialStep} from "@src/react/pages/game/tutorial/types/TutorialStep";

/** Where the tutorial has got to, while it has the board. */
export interface TutorialSituation {
  /** Which scene is on the board, counting from nought. */
  readonly scene: number;
  /** The step that is up, or undefined once the scene's steps have run out. */
  readonly step: TutorialStep | undefined;
  /** Which step it is, counting from one, as the card says it. */
  readonly number: number;
}

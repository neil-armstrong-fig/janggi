import type {Move} from "@janggi/engine/types/Move";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {TutorialActor} from "@src/react/pages/game/tutorial/types/TutorialActor";
import type {TutorialTurn} from "@src/react/pages/game/tutorial/types/TutorialTurn";

/**
 * One turn of a tutorial scene, and who takes it. What the card says while it is the turn to take is in `Messages`
 * (`tutorial.scenes`), at the step's place in its scene.
 */
export interface TutorialStep {
  readonly actor: TutorialActor;
  readonly turn: TutorialTurn;
  /**
   * The army whose side of the board the step's words are about — Han's general in its palace, say — which the card
   * stands away from where the ring allows (`cardDockOf`). Undefined for words about the move alone.
   */
  readonly lookAt?: Side;
  /**
   * A move the step's narration tells of the board refusing — the repetition rule's, which the board marks on the point
   * it would go to, so the refusal is seen there and not only in the note over the board. `TutorialScenes.test.ts` holds
   * it to the engine refusing it.
   */
  readonly heldBack?: Move;
}

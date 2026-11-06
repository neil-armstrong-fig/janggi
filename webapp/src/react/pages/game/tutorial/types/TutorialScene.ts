import type {GameState} from "@janggi/engine/types/GameState";
import type {Outcome} from "@janggi/engine/types/Outcome";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {TutorialSceneName} from "@janggi/shared/janggi/tutorial/TutorialSceneName";
import type {TutorialStep} from "@src/react/pages/game/tutorial/types/TutorialStep";

/** One part of the tutorial: a position, the turns taken from it, and how the game it plays ends. */
export interface TutorialScene {
  /** Which scene it is, by which its words are looked up in `Messages` (`tutorial.scenes`). */
  readonly name: TutorialSceneName;
  readonly start: GameState;
  readonly steps: readonly TutorialStep[];
  /** The army whose side of the board the words once its steps have run out are about, as a step's `lookAt` is. */
  readonly endingLookAt?: Side;
  /**
   * How the game it plays ends, which `TutorialScenes.test.ts` holds it to — `undecided` for a scene that shows a rule
   * keeping the game going rather than ending it.
   */
  readonly outcome: Outcome["kind"];
}

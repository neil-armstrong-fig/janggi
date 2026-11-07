import type {GameState} from "@janggi/engine/types/GameState";

/** Where the tutorial is to start: a scene, counting from nought, and the position it opens on, which is the page's to hand in. */
export interface TutorialEntry {
  readonly scene: number;
  readonly start: GameState;
}

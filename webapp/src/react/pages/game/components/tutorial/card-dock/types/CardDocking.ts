import type {BoardEdge} from "@src/react/pages/game/components/tutorial/card-dock/types/BoardEdge";
import type {TargetRect} from "@src/react/pages/game/hooks/use-target-rect/UseTargetRect";

/** What the card's dock is chosen from: where things stand on the screen, in the page's own pixels. */
export interface CardDocking {
  /** What the ring is round, which the card must never cover; undefined where the step rings nothing. */
  readonly ring: TargetRect | undefined;
  readonly board: TargetRect | undefined;
  /** The card itself, as it stands now — its size and its left and right are the same at either edge. */
  readonly card: TargetRect | undefined;
  /**
   * The edge of the board the step's words are about — Han's side is the top, the tutorial never turning the board — which
   * the card stands away from where the ring allows; undefined where the words are about nothing in particular.
   */
  readonly lookingAt: BoardEdge | undefined;
  readonly viewportHeight: number;
  /** How far down the card's top stands, docked at the top. */
  readonly topEdge: number;
  /** How far down the card's bottom stands, docked at the bottom, above the row of controls. */
  readonly bottomEdge: number;
  /** How far down the card's bottom stands, docked lowest, over the row of controls. */
  readonly lowestEdge: number;
}

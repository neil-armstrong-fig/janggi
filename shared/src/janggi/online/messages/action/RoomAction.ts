import type {WireMove} from "./WireMove.js";

/** A move: the piece on one point goes to another. */
export interface MoveAction {
  readonly kind: "move";
  readonly move: WireMove;
}

/** A turn rested (한수 쉼). */
export interface PassAction {
  readonly kind: "pass";
}

/** Bikjang called: the generals face each other with nothing between. */
export interface CallBikjangAction {
  readonly kind: "call-bikjang";
}

/** A draw offered, for the other to accept. */
export interface OfferDrawAction {
  readonly kind: "offer-draw";
}

/** The draw on offer, accepted. */
export interface AcceptDrawAction {
  readonly kind: "accept-draw";
}

/** The game given up. */
export interface ResignAction {
  readonly kind: "resign";
}

/**
 * Everything a player can do once the game has begun. The engine decides whether it is legal; this only names it, so
 * the webapp and the room speak of a turn the same way, and a game can be replayed from the list of what was done.
 */
export type RoomAction =
  MoveAction | PassAction | CallBikjangAction | OfferDrawAction | AcceptDrawAction | ResignAction;

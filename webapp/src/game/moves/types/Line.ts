import type {Position} from "@src/game/board/types/Position";

/**
 * One line of travel away from a piece, in order, nearest point first.
 *
 * What a chariot and a cannon both walk: the chariot stops at the first piece it meets, the cannon
 * counts them and jumps exactly one. Nothing on a line knows what is standing on it.
 */
export type Line = readonly Position[];

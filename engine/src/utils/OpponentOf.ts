import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** The other army. There are only two, so this is total — every side has an opponent. */
export function opponentOf(side: Side): Side {
  return side === "han" ? "cho" : "han";
}

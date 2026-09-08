import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";

/** One point on a back rank: the piece standing there, or nothing. */
type BackRankPoint = PieceType | undefined;

/**
 * A back rank, files 1 to 9 **as that player sees it**. File 5 is always empty — unlike xiangqi,
 * the janggi general starts on the centre of its palace, one rank in from its own edge.
 *
 * A nine-tuple rather than an array so a setup that names eight or ten points does not compile.
 */
export type BackRank = readonly [
  BackRankPoint,
  BackRankPoint,
  BackRankPoint,
  BackRankPoint,
  BackRankPoint,
  BackRankPoint,
  BackRankPoint,
  BackRankPoint,
  BackRankPoint,
];

/**
 * One of the arrangements a player may choose before the game starts.
 *
 * Janggi has no single fixed opening position. Everything except the back rank is fixed — cannons,
 * soldiers and the general never move at setup — so a setup is exactly a back rank and nothing
 * else. Han lays theirs out first and Cho answers, which is why the two sides are chosen
 * independently and why 16 different opening positions are reachable.
 */
export interface Setup {
  readonly name: SetupName;
  /** The Korean name, shown alongside the English so the two are learnable together. */
  readonly korean: string;
  readonly description: string;
  readonly backRank: BackRank;
}

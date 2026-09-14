import type {File, Position, Rank} from "@src/game/board/types/Position";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {FILES} from "@src/game/board/BoardDimensions";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Setup} from "@src/game/setups/types/Setup";

/** Where one army's ranks sit, counted in from its own edge of the board. */
interface HomeRanks {
  readonly back: Rank;
  readonly palace: Rank;
  readonly cannons: Rank;
  readonly soldiers: Rank;
}

/**
 * The 32 pieces a game opens with, given each player's chosen setup.
 *
 * Placement, not rules — where a piece may go next is the engine's problem and none of this file's.
 * The two setups are separate arguments because the two players genuinely choose separately.
 */
export function startingPieces(hanSetup: Setup, choSetup: Setup): readonly PlacedPiece[] {
  return [...armyFor("han", hanSetup), ...armyFor("cho", choSetup)];
}

/**
 * One player's 16 pieces.
 *
 * Only the back rank varies with the setup; everything else is fixed by the rules, so it is written
 * out point by point rather than generated. Five soldiers on the odd files is plainer said than
 * looped, and what it produces can be read straight off the page and checked against a real board.
 */
function armyFor(side: Side, setup: Setup): PlacedPiece[] {
  const home = HOME_RANKS[side];

  return [
    ...backRankFor(side, setup, home.back),

    placed(side, "general", 5, home.palace),

    placed(side, "cannon", 2, home.cannons),
    placed(side, "cannon", 8, home.cannons),

    placed(side, "soldier", 1, home.soldiers),
    placed(side, "soldier", 3, home.soldiers),
    placed(side, "soldier", 5, home.soldiers),
    placed(side, "soldier", 7, home.soldiers),
    placed(side, "soldier", 9, home.soldiers),
  ];
}

/**
 * A back rank is laid out by board file, the same way round for both armies — so two players who
 * chose the same setup get identical ranks file for file, and the mirrored board is what you get by
 * choosing opposite setups rather than the same one.
 *
 * This is the one part driven by the setup's own data, so it is the one part that loops.
 */
function backRankFor(side: Side, setup: Setup, rank: Rank): PlacedPiece[] {
  const points = setup.backRank;
  const pieces: PlacedPiece[] = [];

  for (let index = 0; index < FILES.length; index += 1) {
    const file = FILES[index];
    const type = points[index];

    if (file && type) pieces.push(placed(side, type, file, rank));
  }

  return pieces;
}

function placed(side: Side, type: PieceType, file: File, rank: Rank): PlacedPiece {
  const position: Position = {file, rank};

  return {piece: {side, type}, position};
}

/**
 * The general starts on the palace centre one rank in — unlike xiangqi, where it sits on the back
 * edge. Han holds ranks 1-4 because the board is drawn with Cho, who moves first, nearest the
 * player.
 */
const HOME_RANKS: Record<Side, HomeRanks> = {
  han: {back: 1, palace: 2, cannons: 3, soldiers: 4},
  cho: {back: 10, palace: 9, cannons: 8, soldiers: 7},
};

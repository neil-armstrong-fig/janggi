import type {FormatRating} from "@src/redux/ratings/types/FormatRating";
import type {GameRecord} from "@src/redux/ratings/types/GameRecord";
import type {FormatToMerge} from "@src/redux/account/merging/merged-ratings/types/FormatToMerge";
import type {SyncedRatings} from "@src/redux/account/data/types/SyncedRatings";
import {freshRatings} from "@src/redux/ratings/fresh-ratings/FreshRatings";

/**
 * The player's record against the bot on two devices as one: every game either holds, once, and a rating that
 * is where the latest of them left it.
 *
 * **A record started again is not undone by the other device.** Each reset is remembered as the time it happened
 * and the later one stands, and any game finished before it belongs to the record that was thrown away — so a
 * device that still holds the old games cannot bring them back.
 *
 * The rating is read off the last surviving game rather than worked out by playing the games through again.
 * A rating is a figure on the player's own record, not a standing anybody competes on, so a game played on two
 * devices at once leaves it where the later game left it and no more precisely than that.
 */
export function mergedRatings(local: SyncedRatings, remote: SyncedRatings): SyncedRatings {
  const resetAt = laterOf(local.resetAt, remote.resetAt);

  return {
    byFormat: {
      Casual: mergedFormat({format: "Casual", local, remote, resetAt}),
      Scored: mergedFormat({format: "Scored", local, remote, resetAt}),
    },
    resetAt,
  };
}

function mergedFormat({format, local, remote, resetAt}: FormatToMerge): FormatRating {
  const games = oldestFirst(
    uniqueGames([...local.byFormat[format].games, ...remote.byFormat[format].games]).filter(
      game => resetAt === undefined || game.finishedAt > resetAt,
    ),
  );

  return {elo: games.at(-1)?.eloAfter ?? freshRatings().byFormat[format].elo, games};
}

/** A game is the same game wherever it was kept: when it finished, who it was against, and how it went. */
function uniqueGames(games: readonly GameRecord[]): readonly GameRecord[] {
  return [...new Map(games.map(game => [identityOf(game), game])).values()];
}

/** Spelled out rather than by serialising the record, which would tell two devices' copies apart by field order. */
function identityOf(game: GameRecord): string {
  return [game.format, game.botElo, game.playerSide, game.finishedAt, game.result, game.ending].join("|");
}

function oldestFirst(games: readonly GameRecord[]): readonly GameRecord[] {
  return [...games].sort((a, b) => a.finishedAt.localeCompare(b.finishedAt));
}

function laterOf(a: string | undefined, b: string | undefined): string | undefined {
  if (a === undefined || b === undefined) return a ?? b;

  return a > b ? a : b;
}

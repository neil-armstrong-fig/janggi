import type {FormatRating} from "@src/redux/ratings/types/FormatRating";
import {MAX_SYNCED_GAMES_PER_FORMAT} from "@src/redux/account/data/MaxSyncedGames";
import {SYNC_DATA_VERSION} from "@src/redux/account/data/SyncDataVersion";
import type {Identified} from "@src/redux/account/data/types/Identified";
import type {SyncData} from "@src/redux/account/data/types/SyncData";

/**
 * The document the server keeps, as text — **the one canonical spelling of it**. Two devices holding the same
 * things write the same text, so a sync that has nothing to add is recognised as one by comparing strings: the
 * styles are listed by id rather than in the order the player keeps them, and the fields are written in a fixed
 * order, which no spread of an object can be trusted to preserve.
 */
export function syncDataText(data: SyncData): string {
  return JSON.stringify({
    v: SYNC_DATA_VERSION,
    progress: {
      xp: data.progress.xp,
      beaten: {
        Casual: {cho: data.progress.beaten.Casual.cho, han: data.progress.beaten.Casual.han},
        Scored: {cho: data.progress.beaten.Scored.cho, han: data.progress.beaten.Scored.han},
      },
    },
    styles: {
      boards: byId(data.styles.boards),
      pieceSets: byId(data.styles.pieceSets),
      deleted: byId(data.styles.deleted),
    },
    ratings: {
      byFormat: {Casual: latestGames(data.ratings.byFormat.Casual), Scored: latestGames(data.ratings.byFormat.Scored)},
      resetAt: data.ratings.resetAt ?? null,
    },
    preferences: {value: data.preferences.value, at: data.preferences.at},
  });
}

function byId<Entry extends Identified>(entries: readonly Entry[]): readonly Entry[] {
  return [...entries].sort((a, b) => a.id.localeCompare(b.id));
}

function latestGames(rating: FormatRating): FormatRating {
  return {elo: rating.elo, games: rating.games.slice(-MAX_SYNCED_GAMES_PER_FORMAT)};
}

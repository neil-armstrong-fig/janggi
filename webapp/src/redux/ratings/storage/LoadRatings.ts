import {BOT_ELOS} from "@janggi/shared/janggi/settings/BotElo";
import type {FormatRating} from "@src/redux/ratings/types/FormatRating";
import {GAME_ENDINGS} from "@src/redux/ratings/types/GameEnding";
import {GAME_RESULTS} from "@src/redux/ratings/types/GameResult";
import type {GameRecord} from "@src/redux/ratings/types/GameRecord";
import {MATCH_FORMATS} from "@janggi/shared/janggi/settings/MatchFormat";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import {RATINGS_STORAGE_KEY} from "@src/redux/ratings/storage/RatingsStorageKey";
import type {RatedGameInProgress} from "@src/redux/ratings/types/RatedGameInProgress";
import type {RatingsSliceState} from "@src/redux/ratings/types/RatingsSliceState";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";
import {freshRatings} from "@src/redux/ratings/fresh-ratings/FreshRatings";
import {isAmong} from "@src/redux/untrusted/IsAmong";
import {isFiniteNumber} from "@src/redux/untrusted/IsFiniteNumber";
import {isObject} from "@src/redux/untrusted/IsObject";
import {readJson} from "@src/redux/device-storage/ReadJson";

/**
 * The ratings kept on the device, or a fresh start.
 *
 * **What comes out of storage is untrusted** — an older version of the app wrote it, or the player's
 * browser, or anybody with the dev tools open — so every field is checked against the vocabulary it
 * claims to use rather than cast. What fails is dropped as narrowly as it can be: one bad game leaves
 * the rest of the record, one bad format leaves the other, and only unreadable JSON starts everything
 * again. A rating is the player's history, so it is worth keeping what can be kept — unlike a game on
 * the board, which `loadGame` refuses whole.
 */
export function loadRatings(storage: Pick<Storage, "getItem"> | undefined): RatingsSliceState {
  const stored = readJson(storage, RATINGS_STORAGE_KEY);
  if (!isObject(stored)) return freshRatings();

  const byFormat = isObject(stored["byFormat"]) ? stored["byFormat"] : {};
  const fresh = freshRatings();

  return {
    byFormat: {
      Casual: formatRatingFrom(byFormat["Casual"], "Casual") ?? fresh.byFormat.Casual,
      Scored: formatRatingFrom(byFormat["Scored"], "Scored") ?? fresh.byFormat.Scored,
    },
    inProgress: inProgressFrom(stored["inProgress"]),
  };
}

function formatRatingFrom(value: unknown, format: MatchFormat): FormatRating | undefined {
  if (!isObject(value) || !isFiniteNumber(value["elo"]) || !Array.isArray(value["games"])) return undefined;

  const games = value["games"].flatMap(game => {
    const record = gameRecordFrom(game);

    return record?.format === format ? [record] : [];
  });

  return {elo: value["elo"], games};
}

function gameRecordFrom(value: unknown): GameRecord | undefined {
  if (!isObject(value)) return undefined;

  const {format, botElo, playerSide, result, ending, eloBefore, eloAfter, finishedAt} = value;
  if (!isAmong(MATCH_FORMATS, format) || !isAmong(BOT_ELOS, botElo) || !isAmong(SIDES, playerSide)) return undefined;
  if (!isAmong(GAME_RESULTS, result) || !isAmong(GAME_ENDINGS, ending)) return undefined;
  if (!isFiniteNumber(eloBefore) || !isFiniteNumber(eloAfter) || typeof finishedAt !== "string") return undefined;

  return {format, botElo, playerSide, result, ending, eloBefore, eloAfter, finishedAt};
}

function inProgressFrom(value: unknown): RatedGameInProgress | undefined {
  if (!isObject(value)) return undefined;

  const {format, botElo, playerSide, startedAt} = value;
  if (!isAmong(MATCH_FORMATS, format) || !isAmong(BOT_ELOS, botElo) || !isAmong(SIDES, playerSide)) return undefined;
  if (typeof startedAt !== "string") return undefined;

  return {format, botElo, playerSide, startedAt};
}

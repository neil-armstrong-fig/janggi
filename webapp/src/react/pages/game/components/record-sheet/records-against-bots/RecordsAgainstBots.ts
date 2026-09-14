import {BOT_ELOS} from "@janggi/shared/janggi/settings/BotElo";
import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {GameRecord} from "@src/redux/ratings/types/GameRecord";
import type {RecordAgainstBot} from "@src/react/pages/game/components/record-sheet/types/RecordAgainstBot";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {SideRecord} from "@src/react/pages/game/components/record-sheet/types/SideRecord";

/**
 * One row per strength of bot, weakest first, counted from the games kept — a strength never played
 * still has its row, so the table does not change shape as the player climbs.
 *
 * Nothing here is stored. The record page asks this on every render, the way the game page asks the
 * engine for a score.
 */
export function recordsAgainstBots(games: readonly GameRecord[]): readonly RecordAgainstBot[] {
  return BOT_ELOS.map(botElo =>
    recordAgainst(
      botElo,
      games.filter(game => game.botElo === botElo),
    ),
  );
}

function recordAgainst(botElo: BotElo, games: readonly GameRecord[]): RecordAgainstBot {
  return {
    botElo,
    played: games.length,
    won: games.filter(({result}) => result === "won").length,
    drawn: games.filter(({result}) => result === "drawn").length,
    lost: games.filter(({result}) => result === "lost").length,
    asCho: sideRecord(games, "cho"),
    asHan: sideRecord(games, "han"),
  };
}

function sideRecord(games: readonly GameRecord[], side: Side): SideRecord {
  const withSide = games.filter(({playerSide}) => playerSide === side);

  return {played: withSide.length, won: withSide.filter(({result}) => result === "won").length};
}

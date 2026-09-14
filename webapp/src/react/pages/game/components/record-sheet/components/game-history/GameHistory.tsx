import type {GameEnding} from "@src/redux/ratings/types/GameEnding";
import type {GameRecord} from "@src/redux/ratings/types/GameRecord";
import type {GameResult} from "@src/redux/ratings/types/GameResult";
import {clsx} from "clsx";
import {sideName} from "@src/react/pages/game/utils/SideNames";

interface Props {
  readonly games: readonly GameRecord[];
}

/** Every rated game in one format, newest first: when, against which bot, as which army, and how it went. */
export function GameHistory({games}: Props): React.JSX.Element {
  const newestFirst = [...games].reverse();

  return (
    <section className="flex shrink-0 flex-col gap-2">
      <h2 className="text-xs font-medium tracking-wide text-white/60 uppercase">Games</h2>

      {newestFirst.length === 0 && <p className="text-sm text-white/50">No games against the bot yet.</p>}

      {newestFirst.length > 0 && (
        <ol className="flex flex-col divide-y divide-white/10">
          {newestFirst.map(game => (
            <li
              key={game.finishedAt}
              data-testid="record-game"
              className="flex items-center justify-between gap-3 py-2 text-sm"
            >
              <span className="flex flex-col">
                <span className="text-white/85">
                  Bot {game.botElo} · as {sideName(game.playerSide)}
                </span>

                <span className="text-xs text-white/50">
                  {new Date(game.finishedAt).toLocaleDateString()} · {ENDING_WORDS[game.ending]}
                </span>
              </span>

              <span className="flex flex-col items-end tabular-nums">
                <span className={clsx("font-semibold", RESULT_TONES[game.result])}>{RESULT_WORDS[game.result]}</span>

                <span className="text-xs text-white/50">{eloChange(game)}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function eloChange({eloBefore, eloAfter}: GameRecord): string {
  const change = eloAfter - eloBefore;

  return `${change >= 0 ? "+" : "-"}${Math.abs(change)} → ${eloAfter}`;
}

const RESULT_WORDS: Record<GameResult, string> = {won: "Won", drawn: "Drawn", lost: "Lost"};

const RESULT_TONES: Record<GameResult, string> = {won: "text-gold", drawn: "text-white/80", lost: "text-danger"};

const ENDING_WORDS: Record<GameEnding, string> = {
  checkmate: "checkmate",
  points: "on points",
  bikjang: "bikjang",
  abandoned: "left unfinished",
};

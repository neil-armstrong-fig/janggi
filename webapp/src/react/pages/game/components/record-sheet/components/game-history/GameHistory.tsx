import type {GameRecord} from "@src/redux/ratings/types/GameRecord";
import type {GameResult} from "@janggi/shared/janggi/results/GameResult";
import {clsx} from "clsx";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

interface Props {
  readonly games: readonly GameRecord[];
}

/** Every rated game in one format, newest first: when, against which bot, as which army, and how it went. */
export function GameHistory({games}: Props): React.JSX.Element {
  const {record} = useMessages();
  const newestFirst = [...games].reverse();

  return (
    <section className="flex shrink-0 flex-col gap-2">
      <h2 className="text-xs font-medium tracking-wide text-white/60 uppercase">{record.games}</h2>

      {newestFirst.length === 0 && <p className="text-sm text-white/50">{record.noGames}</p>}

      {newestFirst.length > 0 && (
        <ol className="flex flex-col divide-y divide-white/10">
          {newestFirst.map(game => (
            <li
              key={game.finishedAt}
              data-testid="record-game"
              className="flex items-center justify-between gap-3 py-2 text-sm"
            >
              <span className="flex flex-col">
                <span className="text-white/85">{record.gameLine(game.botElo, game.playerSide)}</span>

                <span className="text-xs text-white/50">
                  {new Date(game.finishedAt).toLocaleDateString()} · {record.endings[game.ending]}
                </span>
              </span>

              <span className="flex flex-col items-end tabular-nums">
                <span className={clsx("font-semibold", RESULT_TONES[game.result])}>{record.results[game.result]}</span>

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

const RESULT_TONES: Record<GameResult, string> = {won: "text-gold", drawn: "text-white/80", lost: "text-danger"};

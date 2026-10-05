import type {RecordAgainstBot} from "@src/react/pages/game/components/record-sheet/types/RecordAgainstBot";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

interface Props {
  readonly records: readonly RecordAgainstBot[];
}

/**
 * How the player has done against each strength of bot: games, wins, draws and losses, the win rate,
 * and the win rate with each army — Cho moves first and Han has the 덤, so the two are worth telling
 * apart. Wider than a phone, so it scrolls on its own rather than the page.
 */
export function RecordTable({records}: Props): React.JSX.Element {
  const {record, sides} = useMessages();

  return (
    <div className="shrink-0 overflow-x-auto">
      <table className="w-full min-w-[22rem] text-left text-sm tabular-nums">
        <thead className="text-xs tracking-wide text-white/50 uppercase">
          <tr>
            <th className="py-1.5 pr-2 font-medium">{record.bot}</th>

            <th className="py-1.5 pr-2 font-medium">{record.games}</th>

            <th className="py-1.5 pr-2 font-medium">{record.winsDrawsLosses}</th>

            <th className="py-1.5 pr-2 font-medium">{record.winRate}</th>

            <th title={record.winRateAs("cho")} className="py-1.5 pr-2 font-medium text-cho">
              <span aria-hidden className="mr-1 inline-block size-2 rounded-full bg-cho" />
              {sides.cho}
            </th>

            <th title={record.winRateAs("han")} className="py-1.5 font-medium text-han">
              <span aria-hidden className="mr-1 inline-block size-2 rounded-full bg-han" />
              {sides.han}
            </th>
          </tr>
        </thead>

        <tbody className="text-white/85">
          {records.map(record => (
            <tr
              key={record.botElo}
              data-testid={`record-row-${record.botElo}`}
              data-played={record.played}
              data-won={record.won}
              data-drawn={record.drawn}
              data-lost={record.lost}
              className="border-t border-white/10"
            >
              <td className="py-1.5 pr-2 font-semibold">{record.botElo}</td>

              <td className="py-1.5 pr-2">{record.played}</td>

              <td className="py-1.5 pr-2">
                {record.won}-{record.drawn}-{record.lost}
              </td>

              <td className="py-1.5 pr-2">{winRate(record.won, record.played)}</td>

              <td className="py-1.5 pr-2">{winRate(record.asCho.won, record.asCho.played)}</td>

              <td className="py-1.5">{winRate(record.asHan.won, record.asHan.played)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A win rate as a whole percentage, or a dash where there is nothing to divide by. */
function winRate(won: number, played: number): string {
  if (played === 0) {
    return "—";
  }

  return `${Math.round((won / played) * 100)}%`;
}

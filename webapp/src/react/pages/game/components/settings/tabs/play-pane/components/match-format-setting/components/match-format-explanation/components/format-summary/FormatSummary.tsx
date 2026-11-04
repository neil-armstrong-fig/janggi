import type {FormatSummaryMessages} from "@src/language/types/format-explanation/FormatSummaryMessages";
import {WordRunsText} from "@src/react/pages/game/components/settings/tabs/play-pane/components/match-format-setting/components/match-format-explanation/components/format-summary/components/word-runs-text/WordRunsText";

interface Props {
  readonly name: string;
  readonly words: FormatSummaryMessages;
}

/** One match format, in a line and then the points a player meets. */
export function FormatSummary({name, words}: Props): React.JSX.Element {
  return (
    <section className="flex flex-col gap-1">
      <h3 className="font-semibold text-wood">{name}</h3>

      <p className="text-xs text-white/60">{words.summary}</p>

      <ul className="flex list-disc flex-col gap-1 pl-4">
        {words.points.map(point => (
          <li key={JSON.stringify(point)}>
            <WordRunsText runs={point} />
          </li>
        ))}
      </ul>
    </section>
  );
}

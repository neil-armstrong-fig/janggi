import {FormatSummary} from "@src/react/pages/game/components/settings/tabs/play-pane/components/match-format-setting/components/match-format-explanation/components/format-summary/FormatSummary";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

/**
 * What sets janggi's two games apart, in as few plain words as will do it on a phone.
 *
 * Only what a player meets is here — how the armies are laid out, when a bikjang may be called and
 * what calling one does — and the rules that are the same in both are gathered in one line at the foot.
 * The reasoning and the sources are `docs/rules.md` §6.2 and §6.6; the rules themselves are
 * `canPlace`, `canCallBikjang` and `outcomeOf`. Stacked rather than side by side, because two columns
 * across a phone leave each too narrow to read.
 */
export function MatchFormatExplanation(): React.JSX.Element {
  const {play} = useMessages();
  const {casual, scored, both} = play.formatExplanation;

  return (
    <div className="flex flex-col gap-3">
      <FormatSummary name={play.formatNames.Casual} words={casual} />

      <FormatSummary name={play.formatNames.Scored} words={scored} />

      <p className="text-xs text-white/60">{both}</p>
    </div>
  );
}

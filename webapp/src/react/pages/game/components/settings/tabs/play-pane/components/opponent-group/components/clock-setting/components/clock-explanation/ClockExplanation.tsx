import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

/** What a clock is, for someone who has never played on one (`ClockExplanationMessages`). */
export function ClockExplanation(): React.JSX.Element {
  const {explanation} = useMessages().clock;

  return (
    <div className="flex flex-col gap-2">
      <p>{explanation.intro}</p>

      <p>{explanation.freeTime}</p>

      <p>{explanation.overtime}</p>

      <p>{explanation.lostOnTime}</p>

      <p>{explanation.readingAFormat}</p>

      <p className="text-xs text-white/60">{explanation.smallPrint}</p>
    </div>
  );
}

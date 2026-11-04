import type {WordRuns} from "@src/language/types/format-explanation/WordRuns";

interface Props {
  readonly runs: WordRuns;
}

/** A sentence whose emphasis each language places for itself. */
export function WordRunsText({runs}: Props): React.JSX.Element {
  return (
    <>
      {runs.map(run => {
        if (typeof run === "string") return run;

        return <strong key={run.strong}>{run.strong}</strong>;
      })}
    </>
  );
}

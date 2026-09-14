import {MATCH_FORMATS} from "@janggi/shared/janggi/settings/MatchFormat";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import {clsx} from "clsx";

interface Props {
  readonly selected: MatchFormat;
  readonly onSelect: (format: MatchFormat) => void;
}

/** One tab per match format, since each is rated apart. The chosen one is pressed. */
export function FormatTabs({selected, onSelect}: Props): React.JSX.Element {
  return (
    <nav aria-label="Match format" className="flex shrink-0 gap-1 rounded-xl bg-black/25 p-1">
      {MATCH_FORMATS.map(format => (
        <button
          key={format}
          type="button"
          data-testid={`record-tab-${format.toLowerCase()}`}
          aria-pressed={format === selected}
          onClick={() => onSelect(format)}
          className={clsx(
            "h-9 flex-1 cursor-pointer rounded-lg text-sm font-semibold transition-colors duration-150 motion-reduce:transition-none",
            format === selected ? "bg-wood/25 text-wood" : "text-white/60 hover:bg-white/5",
          )}
        >
          {format}
        </button>
      ))}
    </nav>
  );
}

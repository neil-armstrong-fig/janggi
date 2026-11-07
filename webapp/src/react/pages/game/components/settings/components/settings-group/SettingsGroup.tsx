import {ChevronDownIcon} from "@src/react/pages/game/components/svg-icon/icons/chevron-down/ChevronDownIcon";
import {clsx} from "clsx";
import {useId} from "react";

/**
 * A summary row that unfolds to its settings. The pane owns which group is open.
 * Folded content stays mounted so picker state and unfinished forms survive folding.
 * The summary contains text only; controls belong in the expanded content.
 */
interface Props {
  readonly name: string;
  readonly label: string;
  /** What the group is set to, in a few words. It must carry no control. */
  readonly summary: React.ReactNode;
  readonly open: boolean;
  readonly onToggle: () => void;
  readonly children: React.ReactNode;
}

export function SettingsGroup({name, label, summary, open, onToggle, children}: Props): React.JSX.Element {
  const contentId = useId();

  return (
    <section
      data-testid="settings-group"
      data-group={name}
      data-open={open}
      className={clsx(
        "flex flex-col rounded-xl border",
        open && "border-wood/50 bg-ground-raised/95",
        !open && "border-white/15 bg-black/25",
      )}
    >
      <button
        type="button"
        data-testid="settings-group-toggle"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={onToggle}
        className={clsx(
          "flex min-h-11 w-full cursor-pointer items-center gap-3 px-3 py-2 text-left",
          open && "rounded-t-xl bg-wood/10 hover:bg-wood/15",
          !open && "rounded-xl hover:bg-white/5",
        )}
      >
        <span
          className={clsx(
            "w-20 shrink-0 text-sm",
            open && "font-semibold text-wood",
            !open && "font-medium text-white/75",
          )}
        >
          {label}
        </span>

        <span
          data-testid="settings-group-summary"
          className="min-w-0 flex-1 wrap-anywhere text-right text-sm text-white/90"
        >
          {summary}
        </span>

        <ChevronDownIcon
          className={clsx(
            "h-4 w-4 shrink-0 transition-transform duration-150 motion-reduce:transition-none",
            open && "rotate-180 text-wood",
            !open && "text-white/60",
          )}
        />
      </button>

      <div id={contentId} hidden={!open} className="flex flex-col gap-3 border-t border-wood/25 p-3">
        {children}
      </div>
    </section>
  );
}

import {SIDES} from "@janggi/shared/janggi/pieces/Side";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {clsx} from "clsx";
import {sideName} from "@src/react/pages/game/utils/SideNames";

/**
 * Han | Cho: which army's opening setup is showing beneath it.
 *
 * The two armies choose separately, but they share one place in the sheet, because two grids of setups
 * would not fit a phone's sheet. Pressing an army only turns that army's grid up — it chooses nothing
 * about the game.
 */
interface Props {
  readonly showing: Side;
  readonly onShow: (side: Side) => void;
}

export function ArmySwitch({showing, onShow}: Props): React.JSX.Element {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-xs font-medium text-white/60">Setup</span>

      <div
        role="group"
        aria-label="Which army's setup to show"
        className="flex min-w-0 flex-1 gap-1 rounded-xl bg-black/25 p-1"
      >
        {SIDES.map(side => (
          <button
            key={side}
            type="button"
            data-testid={`setup-army-${side}`}
            aria-pressed={side === showing}
            onClick={() => onShow(side)}
            className={clsx(
              "min-h-11 flex-1 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 motion-reduce:transition-none",
              side === showing ? "bg-wood text-ink shadow" : "text-white/70 hover:bg-white/10",
            )}
          >
            {sideName(side)}
          </button>
        ))}
      </div>
    </div>
  );
}

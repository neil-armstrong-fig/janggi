import {useState} from "react";

interface Props {
  readonly onReset: () => void;
}

/**
 * Clears the player's record — the rating and every game, in both formats.
 *
 * **It asks first, in place.** Nothing about a reset can be taken back, so the first press only opens a
 * question under the button, and the record is cleared by answering it. In place rather than in a
 * browser `confirm`, which is a jolt on a phone and cannot be styled or reached by a spec. Whether it is
 * asking is this button's own state: nothing else needs to know.
 */
export function ResetRecordButton({onReset}: Props): React.JSX.Element {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex shrink-0 flex-col gap-2">
      {!confirming && (
        <button
          type="button"
          data-testid="record-reset"
          onClick={() => setConfirming(true)}
          className="h-11 cursor-pointer rounded-xl border border-danger/40 text-sm font-semibold tracking-wide text-danger uppercase transition-[transform,background-color] duration-150 hover:bg-danger/10 active:scale-[0.98] motion-reduce:transition-none"
        >
          Reset record
        </button>
      )}

      {confirming && (
        <div
          role="alertdialog"
          aria-label="Reset your record"
          className="flex flex-col gap-3 rounded-xl bg-danger/10 p-3"
        >
          <p className="text-sm text-white/85">
            Clear your rating and every game, in both formats? This cannot be undone.
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              data-testid="record-reset-cancel"
              onClick={() => setConfirming(false)}
              className="h-10 flex-1 cursor-pointer rounded-lg bg-black/25 text-sm font-semibold text-white/80 hover:bg-black/35"
            >
              Keep it
            </button>

            <button
              type="button"
              data-testid="record-reset-confirm"
              onClick={() => {
                setConfirming(false);
                onReset();
              }}
              className="h-10 flex-1 cursor-pointer rounded-lg bg-danger/80 text-sm font-semibold text-white hover:bg-danger"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import type {PasteResult} from "@src/react/pages/game/components/paste-key/types/PasteResult";
import {clsx} from "clsx";

/**
 * The top of a style being made: back out of it, name it, save it, and — beneath — how the last save went.
 * The same whichever kind of style it is, and the same on a phone and on a desktop.
 */
interface Props {
  readonly name: string;
  readonly onName: (name: string) => void;
  readonly onSave: () => void;
  readonly onBack: () => void;
  /** How the last save went. */
  readonly pasteResult: PasteResult | undefined;
}

export function EditorHeader({name, onName, onSave, onBack, pasteResult}: Props): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          data-testid="style-editor-back"
          onClick={onBack}
          className="h-11 shrink-0 cursor-pointer rounded-xl bg-white/10 px-3 text-sm text-white/80 hover:bg-white/15"
        >
          Back
        </button>

        <input
          data-testid="style-editor-name"
          aria-label="A name for your style"
          placeholder="A name for your style"
          value={name}
          maxLength={40}
          onChange={event => onName(event.target.value)}
          className="h-11 min-w-0 flex-1 rounded-xl bg-black/25 px-3 text-base text-white/90 placeholder:text-white/30"
        />

        <button
          type="button"
          data-testid="style-editor-save"
          onClick={onSave}
          className="h-11 shrink-0 cursor-pointer rounded-xl bg-wood px-4 text-sm font-semibold tracking-wide text-ink uppercase shadow transition-[transform,background-color] duration-150 hover:bg-wood/90 active:scale-[0.98] motion-reduce:transition-none"
        >
          Save
        </button>
      </div>

      {pasteResult && (
        <p
          data-testid="style-editor-message"
          data-accepted={pasteResult.accepted}
          role="status"
          className={clsx("text-xs break-words", pasteResult.accepted ? "text-cho" : "text-danger")}
        >
          {pasteResult.message}
        </p>
      )}
    </div>
  );
}

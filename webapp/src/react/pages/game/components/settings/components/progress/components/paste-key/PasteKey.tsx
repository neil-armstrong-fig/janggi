import type {PasteResult} from "@src/react/pages/game/components/settings/components/progress/components/paste-key/types/PasteResult";
import {clsx} from "clsx";
import {useState} from "react";

/**
 * A box to paste a key into and a button to use it — a save to load, or a style somebody shared — with
 * a line under it saying what came of it. What a key *means* is the caller's to decide; this only takes
 * the text and shows the answer.
 *
 * Here beneath `Progress`, which loads saves with it; the styles sheet reaches in for it to import styles.
 *
 * The text is 16px because iOS zooms the page into any form field smaller than that when it is focused.
 */
interface Props {
  /** Prefixes the `data-testid` of the box, the button and the line under them. */
  readonly id: string;
  readonly label: string;
  readonly placeholder: string;
  readonly onSubmit: (text: string) => PasteResult;
}

export function PasteKey({id, label, placeholder, onSubmit}: Props): React.JSX.Element {
  const [text, setText] = useState("");
  const [pasteResult, setPasteResult] = useState<PasteResult | undefined>(undefined);

  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        data-testid={`${id}-input`}
        aria-label={placeholder}
        placeholder={placeholder}
        value={text}
        rows={2}
        spellCheck={false}
        onChange={event => {
          setText(event.target.value);
          setPasteResult(undefined);
        }}
        className="w-full resize-none rounded-xl bg-black/25 px-3 py-2 font-mono text-base break-all text-white/90 placeholder:text-white/30"
      />

      <button
        type="button"
        data-testid={`${id}-submit`}
        disabled={text.trim() === ""}
        onClick={() => {
          const submitted = onSubmit(text);
          setPasteResult(submitted);
          if (submitted.accepted) setText("");
        }}
        className="h-11 rounded-xl bg-black/25 text-sm font-semibold tracking-wide text-white/80 uppercase transition-[transform,background-color] duration-150 enabled:cursor-pointer enabled:hover:bg-black/35 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
      >
        {label}
      </button>

      {pasteResult && (
        <p
          data-testid={`${id}-message`}
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

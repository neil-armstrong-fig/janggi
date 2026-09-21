import {useState} from "react";

/**
 * A button that copies a key to share — the player's save, or one of their styles — and shows the key
 * it copied, selected on focus, for wherever the clipboard is out of reach: a page served insecurely, a
 * browser that asks first, or a player who would rather see what they are sending.
 *
 * The key is worked out when the button is pressed rather than on every render, since a save carries
 * every style the player owns.
 *
 * Here beneath `Progress`, which shares the save with it; the styles sheet reaches in for it to share a
 * style.
 */
interface Props {
  /** Prefixes the `data-testid` of the button and the key shown under it. */
  readonly id: string;
  readonly label: string;
  readonly keyOf: () => string;
}

export function ShareKey({id, label, keyOf}: Props): React.JSX.Element {
  const [shown, setShown] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        data-testid={`${id}-copy`}
        onClick={() => {
          const key = keyOf();
          setShown(key);
          setCopied(false);
          void copiedToClipboard(key).then(setCopied);
        }}
        className="h-11 cursor-pointer rounded-xl bg-black/25 text-sm font-semibold tracking-wide text-white/80 uppercase transition-[transform,background-color] duration-150 hover:bg-black/35 active:scale-[0.98] motion-reduce:transition-none"
      >
        {label}
      </button>

      {shown !== undefined && (
        <textarea
          data-testid={`${id}-key`}
          aria-label="The key to share"
          readOnly
          value={shown}
          rows={3}
          onFocus={event => event.currentTarget.select()}
          className="w-full resize-none rounded-xl bg-black/25 px-3 py-2 font-mono select-text text-base break-all text-white/80"
        />
      )}

      {shown !== undefined && (
        <p className="text-xs text-white/50">
          {copied ? "Copied. Keep it somewhere safe, or send it on." : "Select the key above and copy it."}
        </p>
      )}
    </div>
  );
}

async function copiedToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch {
    return false;
  }
}

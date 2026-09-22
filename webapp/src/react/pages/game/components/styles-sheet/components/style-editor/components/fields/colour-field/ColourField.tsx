import {clsx} from "clsx";
import {colourPartsOf} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/colour-field/colour/ColourPartsOf";
import {cssColourOf} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/fields/colour-field/colour/CssColourOf";
import {isCssValue} from "@src/redux/untrusted/IsCssValue";
import {useState} from "react";

/**
 * One colour of a style, chosen with the browser's own picker and, where the style may use it, a slider
 * for how see-through it is.
 *
 * A colour the picker cannot hold — a gradient, a named colour — is shown as text to edit instead, with
 * a button to swap it for a plain one, rather than flattened to something the style never had. What is
 * typed is only passed on once it is a CSS value the app will paint with, as an imported style's must be.
 */
interface Props {
  /** What the test id is built from: `style-control-<id>`. */
  readonly id: string;
  readonly label: string;
  /** Any CSS colour. */
  readonly value: string;
  /** Whether it may be see-through, which a wash is and a line is not. */
  readonly translucent?: boolean;
  readonly onChange: (colour: string) => void;
}

export function ColourField({id, label, value, translucent = false, onChange}: Props): React.JSX.Element {
  const colourParts = colourPartsOf(value);
  const [typed, setTyped] = useState<string | undefined>(undefined);
  const shown = typed ?? value;
  const acceptable = isCssValue(shown) && shown.trim() !== "";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="w-28 shrink-0 text-xs text-white/70">{label}</span>

        {colourParts && (
          <>
            <input
              type="color"
              data-testid={`style-control-${id}`}
              aria-label={label}
              value={colourParts.hex}
              onChange={event => onChange(cssColourOf({hex: event.target.value, alpha: colourParts.alpha}))}
              className="h-9 w-12 shrink-0 cursor-pointer rounded-lg bg-black/25 p-1"
            />

            {translucent && (
              <input
                type="range"
                data-testid={`style-control-${id}-alpha`}
                aria-label={`${label}, how solid`}
                min={0}
                max={1}
                step={0.01}
                value={colourParts.alpha}
                onChange={event => onChange(cssColourOf({hex: colourParts.hex, alpha: Number(event.target.value)}))}
                className="h-9 min-w-0 flex-1 cursor-pointer accent-wood"
              />
            )}
          </>
        )}

        {!colourParts && (
          <>
            <input
              type="text"
              data-testid={`style-control-${id}`}
              aria-label={label}
              value={shown}
              spellCheck={false}
              onChange={event => {
                setTyped(event.target.value);
                if (isCssValue(event.target.value) && event.target.value.trim() !== "") onChange(event.target.value);
              }}
              onBlur={() => setTyped(undefined)}
              className={clsx(
                "h-9 min-w-0 flex-1 rounded-lg bg-black/25 px-2 font-mono text-xs text-white/90",
                !acceptable && "text-danger",
              )}
            />

            <button
              type="button"
              data-testid={`style-control-${id}-plain`}
              onClick={() => {
                setTyped(undefined);
                onChange("#808080");
              }}
              className="h-9 shrink-0 cursor-pointer rounded-lg bg-white/10 px-2 text-xs text-white/80 hover:bg-white/15"
            >
              Plain colour
            </button>
          </>
        )}
      </div>

      {!colourParts && !acceptable && (
        <p className="pl-[7.5rem] text-xs text-danger">Not a colour the app will paint with.</p>
      )}
    </div>
  );
}

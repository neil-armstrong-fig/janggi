import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {Checked} from "@src/redux/custom-styles/untrusted/types/Checked";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {StyleView} from "@src/react/pages/game/components/styles-sheet/components/style-editor/types/StyleView";
import {useState} from "react";
import {writtenOut} from "@src/react/pages/game/components/styles-sheet/components/style-editor/hooks/use-style-draft/written-out/WrittenOut";

/** A style being made, and the two views of it. */
export interface StyleDraft<Style> {
  readonly style: Style;
  /** Changes the style by hand, from what it is now. */
  readonly change: (update: (style: Style) => Style) => void;
  /** Puts another style in its place — one loaded from a key, or copied from a style the player has. */
  readonly replace: (style: Style) => void;
  /** Puts back the style it was started from, and with it every change made since. */
  readonly reset: () => void;
  readonly view: StyleView;
  readonly showRaw: () => void;
  readonly showControls: () => void;
  /** The raw view's text: what was typed there, whether or not it made a style. */
  readonly raw: string;
  /** What is wrong with the raw text, if it is not a style. */
  readonly rawRefusal: string | undefined;
  readonly writeRaw: (text: string) => void;
  /**
   * Why the style cannot be saved yet, if it cannot: the raw view is open on text that is not a style, and a
   * save would quietly keep the last style that was one instead of what is on screen.
   */
  readonly unsavable: string | undefined;
}

/**
 * A style being made, held while it is turned by hand and while it is written as JSON, as the same style.
 * The raw text is checked as an imported style is, and only a text that passes replaces the style: what a
 * player has half-typed is kept in the box and never reaches the preview, which keeps the last style that was one.
 *
 * Opening the raw view writes the style out afresh, so it shows what the controls have made of it.
 */
export function useStyleDraft<Style extends BoardStyle | PieceSetStyle>(
  start: Style,
  read: (text: string) => Checked<Style>,
): StyleDraft<Style> {
  const [style, setStyle] = useState(start);
  const [view, setView] = useState<StyleView>("controls");
  const [raw, setRaw] = useState("");
  const [rawRefusal, setRawRefusal] = useState<string | undefined>(undefined);

  // The raw view, if it is open, shows what it was put in place of.
  const replace = (next: Style): void => {
    setStyle(next);
    setRaw(writtenOut(next));
    setRawRefusal(undefined);
  };

  return {
    style,
    view,
    raw,
    rawRefusal,
    unsavable: view === "raw" ? rawRefusal : undefined,

    change(update): void {
      setStyle(update);
    },

    replace,

    reset(): void {
      replace(start);
    },

    showRaw(): void {
      setRaw(writtenOut(style));
      setRawRefusal(undefined);
      setView("raw");
    },

    showControls(): void {
      setView("controls");
    },

    writeRaw(text): void {
      setRaw(text);

      const checked = read(text);
      if (checked.kind === "accepted") {
        setStyle(checked.value);
        setRawRefusal(undefined);
        return;
      }

      setRawRefusal(checked.reason);
    },
  };
}

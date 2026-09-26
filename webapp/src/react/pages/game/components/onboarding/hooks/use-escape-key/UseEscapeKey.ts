import {useEffect} from "react";

/**
 * Calls `onEscape` whenever Escape is pressed, for as long as the caller is on the page — how the
 * welcome and the tour are skipped from the keyboard. Heard on the document, since neither takes focus
 * from the board the way an input would.
 */
export function useEscapeKey(onEscape: () => void): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onEscape();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onEscape]);
}

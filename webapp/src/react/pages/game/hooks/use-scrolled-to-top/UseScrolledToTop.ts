import {scrollToTop} from "@src/react/pages/game/hooks/use-scrolled-to-top/utils/ScrollToTop";
import {useEffect} from "react";
import type {RefObject} from "react";

/**
 * Keeps a sheet from being shown part way down. Whenever it is opened — and, where `showing` counts the other
 * times it is pointed at something (a tab chosen, a sign-in sent to), each of those too — everything in it that
 * scrolls goes back to its top, so what a sheet is opened to show is never out of sight above the fold.
 */
export function useScrolledToTop(sheet: RefObject<HTMLElement | null>, open: boolean, showing = 0): void {
  useEffect(() => {
    if (open && sheet.current) scrollToTop(sheet.current);
  }, [sheet, open, showing]);
}

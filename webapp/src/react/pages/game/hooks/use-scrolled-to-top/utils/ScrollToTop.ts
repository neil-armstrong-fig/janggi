/** Scrolls every scrolled element in `root` — its own scroll, and any column inside it that scrolls — back to its top. */
export function scrollToTop(root: HTMLElement): void {
  for (const element of [root, ...root.querySelectorAll<HTMLElement>("*")]) {
    if (element.scrollTop > 0) element.scrollTop = 0;
  }
}

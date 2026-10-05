/**
 * The frame every stroked icon in the page is drawn in: a 24x24 box, drawn in the surrounding text
 * colour with round ends, and hidden from assistive technology, since whatever carries it names itself.
 *
 * Icons are drawn from strokes rather than taken from an icon set. Each glyph is a component of its own
 * in `icons/`, so it is found, edited and reused in one place; this holds only what they all share.
 */
interface Props {
  /** The strokes of the icon. */
  readonly children: React.ReactNode;
  /** Sizes it; a tab's picture is the same as a control's by default. */
  readonly className?: string;
}

export function SvgIcon({children, className = "h-5 w-5"}: Props): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

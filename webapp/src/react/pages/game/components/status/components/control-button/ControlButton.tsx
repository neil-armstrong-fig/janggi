/**
 * One control in the row under the board: an icon over a short label, the whole cell a target.
 *
 * Every control in the row is one of these, so they share a size, a press and a disabled look
 * rather than five copies of one class string drifting apart. Each fills an equal share of the row,
 * which keeps a thumb-sized target on the narrowest phone and stops the row reflowing when a control
 * is disabled.
 *
 * It sinks a little when pressed. That is the one piece of feedback a control owes a tap before the
 * game has had a chance to answer it.
 */
interface Props {
  readonly testId: string;
  readonly label: string;
  /** The strokes of a 24x24 icon, drawn in the button's own colour. */
  readonly icon: React.ReactNode;
  readonly enabled?: boolean;
  readonly onPress: () => void;
}

export function ControlButton({testId, label, icon, enabled = true, onPress}: Props): React.JSX.Element {
  return (
    <button
      type="button"
      data-testid={testId}
      disabled={!enabled}
      onClick={onPress}
      className="flex h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl bg-white/5 text-white/80 transition-[transform,background-color] duration-150 enabled:cursor-pointer enabled:hover:bg-white/10 enabled:active:scale-95 disabled:opacity-30 motion-reduce:transition-none"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon}
      </svg>

      <span className="text-[10px] font-medium tracking-wide uppercase">{label}</span>
    </button>
  );
}

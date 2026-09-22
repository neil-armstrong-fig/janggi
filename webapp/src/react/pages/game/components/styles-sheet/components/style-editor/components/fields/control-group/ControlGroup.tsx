/**
 * A titled set of controls that belong together — the lines, the marker, the check. Focusing any control in
 * it says so, so the preview can be turned to the position in which that group's marks are on show.
 */
interface Props {
  readonly title: string;
  /** Called as focus enters the group, whichever control took it. */
  readonly onFocus?: () => void;
  readonly children: React.ReactNode;
}

export function ControlGroup({title, onFocus, children}: Props): React.JSX.Element {
  return (
    <section aria-label={title} onFocus={onFocus} className="flex flex-col gap-2">
      <h4 className="border-b border-white/10 pb-1 text-xs font-semibold tracking-wide text-white/40 uppercase">
        {title}
      </h4>

      {children}
    </section>
  );
}

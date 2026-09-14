/**
 * A titled group of settings in the sheet — "This game", "Appearance" — so a player looking for the
 * piece set does not have to read past the opening setups to find it.
 */
interface Props {
  readonly title: string;
  readonly children: React.ReactNode;
}

export function SettingsGroup({title, children}: Props): React.JSX.Element {
  return (
    <section aria-label={title} className="flex flex-col gap-3">
      <h3 className="border-b border-white/10 pb-1 text-xs font-semibold tracking-wide text-white/40 uppercase">
        {title}
      </h3>

      {children}
    </section>
  );
}

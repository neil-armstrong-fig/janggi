interface Props {
  readonly children: React.ReactNode;
}

/** A directly accessible section, wearing the same frame as an expanded settings group. */
export function SettingsSection({children}: Props): React.JSX.Element {
  return (
    <section
      data-testid="settings-section"
      className="flex flex-col gap-3 rounded-xl border border-wood/50 bg-ground-raised/95 p-3"
    >
      {children}
    </section>
  );
}

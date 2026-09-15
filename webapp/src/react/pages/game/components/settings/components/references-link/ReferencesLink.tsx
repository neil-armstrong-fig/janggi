export function ReferencesLink(): React.JSX.Element {
  return (
    <a
      data-testid="references-open"
      href={`${import.meta.env.BASE_URL}references.html`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-11 items-center justify-between gap-4 rounded-lg border border-wood/20 px-3 py-2 text-sm text-wood hover:bg-wood/10"
    >
      <span>References &amp; credits</span>

      <span className="text-xs text-wood/70">Opens in a new tab</span>
    </a>
  );
}

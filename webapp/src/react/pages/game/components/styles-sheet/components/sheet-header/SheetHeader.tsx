/** The top of the styles sheet: what it is, and the way to close it. */
interface Props {
  readonly onClose: () => void;
}

export function SheetHeader({onClose}: Props): React.JSX.Element {
  return (
    <header className="flex shrink-0 items-center justify-between px-4 pt-3 pb-1">
      <h2 className="text-sm font-semibold tracking-wide text-wood uppercase">Your styles</h2>

      <button
        type="button"
        data-testid="styles-close"
        aria-label="Close your styles"
        onClick={onClose}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/70 hover:bg-white/10"
      >
        <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
        </svg>
      </button>
    </header>
  );
}

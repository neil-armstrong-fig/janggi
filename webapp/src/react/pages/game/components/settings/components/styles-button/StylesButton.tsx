interface Props {
  readonly onOpen: () => void;
}

/** Opens the player's own styles — to import one somebody shared, share one, or make one. */
export function StylesButton({onOpen}: Props): React.JSX.Element {
  return (
    <button
      type="button"
      data-testid="styles-open"
      onClick={onOpen}
      className="h-11 cursor-pointer rounded-xl bg-black/25 text-sm font-semibold tracking-wide text-white/80 uppercase transition-[transform,background-color] duration-150 hover:bg-black/35 active:scale-[0.98] motion-reduce:transition-none"
    >
      Your styles
    </button>
  );
}

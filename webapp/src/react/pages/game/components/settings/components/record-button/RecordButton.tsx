interface Props {
  readonly onOpen: () => void;
}

/** Opens the player's record against the bot — their rating in each format and every game behind it. */
export function RecordButton({onOpen}: Props): React.JSX.Element {
  return (
    <button
      type="button"
      data-testid="record-open"
      onClick={onOpen}
      className="h-11 cursor-pointer rounded-xl bg-black/25 text-sm font-semibold tracking-wide text-white/80 uppercase transition-[transform,background-color] duration-150 hover:bg-black/35 active:scale-[0.98] motion-reduce:transition-none"
    >
      Your record
    </button>
  );
}

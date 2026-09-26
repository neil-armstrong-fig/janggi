interface Props {
  readonly onContinue: () => void;
}

/** The welcome's first screen: what Janggi is, in three short lines. */
export function WelcomeIntro({onContinue}: Props): React.JSX.Element {
  return (
    <>
      <h2
        id="welcome-title"
        tabIndex={-1}
        autoFocus
        className="text-lg font-semibold tracking-wide text-wood outline-none"
      >
        Welcome to Janggi
      </h2>

      <p className="text-sm text-white/80">
        Janggi is Korean chess. Two armies, Cho and Han, trade blows across the board, and whoever captures the opposing
        general wins.
      </p>

      <p className="text-sm text-white/80">
        You start against a gentle bot, and you do not need an account. Everything you set is kept on this device.
      </p>

      <button
        type="button"
        data-testid="welcome-next"
        onClick={onContinue}
        className="cursor-pointer rounded-lg bg-gold px-4 py-3 font-semibold text-ink"
      >
        Next
      </button>
    </>
  );
}

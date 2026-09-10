/**
 * Calls the bikjang — 빅장, the two generals come to face each other down an open file and either
 * player may stop the game on it. See `docs/rules.md` §6.2.
 *
 * A control rather than a gesture on the board, for the reason `PassButton` is one: calling a
 * bikjang moves nothing, so there is no intersection for it to be a tap on. The generals are already
 * standing where they need to stand — what is missing is somebody saying so.
 *
 * Disabled rather than hidden when there is nothing to call, so the row does not reflow under a
 * thumb every time a general steps off a file. It is disabled far more often than `Pass` is: in a
 * casual game whenever the generals are not facing, and in a scored one until both armies are under
 * thirty points as well.
 */
interface Props {
  readonly enabled: boolean;
  readonly onCall: () => void;
}

export function BikjangButton({enabled, onCall}: Props): React.JSX.Element {
  return (
    <button
      type="button"
      data-testid="bikjang"
      disabled={!enabled}
      onClick={onCall}
      className="shrink-0 rounded-full border border-white/20 px-3 py-1 text-[11px] tracking-wide text-white/70 uppercase enabled:cursor-pointer disabled:opacity-30"
    >
      Bikjang
    </button>
  );
}

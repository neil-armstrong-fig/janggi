import {useReleaseUpdate} from "@src/react/release-update/hooks/use-release-update/UseReleaseUpdate";

/** A waiting release, kept compact and optional so it never interrupts the game in progress. */
export function ReleaseUpdate(): React.JSX.Element | null {
  const {available, leaveUntilLater, refresh} = useReleaseUpdate();
  if (!available) return null;

  return (
    <aside
      data-testid="release-update"
      role="status"
      aria-live="polite"
      className="fixed inset-x-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-md items-center gap-2 rounded-2xl border border-gold/40 bg-ground-raised/95 p-3 text-wood shadow-2xl shadow-black/40 backdrop-blur-sm"
    >
      <p className="min-w-0 flex-1 text-sm font-medium">A new version is ready</p>

      <button
        data-testid="release-update-refresh"
        type="button"
        onClick={() => void refresh()}
        className="min-h-11 cursor-pointer rounded-xl bg-wood px-3 text-sm font-semibold text-ink hover:bg-wood/90 active:scale-[0.97]"
      >
        Refresh
      </button>

      <button
        data-testid="release-update-later"
        type="button"
        onClick={leaveUntilLater}
        className="min-h-11 cursor-pointer rounded-xl px-3 text-sm font-semibold text-wood hover:bg-wood/10 active:scale-[0.97]"
      >
        Later
      </button>
    </aside>
  );
}

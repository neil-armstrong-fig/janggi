import {clsx} from "clsx";
import {useTurnNotifications} from "@src/react/pages/game/components/settings/tabs/you-pane/components/account/components/turn-notifications/hooks/use-turn-notifications/UseTurnNotifications";

/**
 * The switch, in the signed-in account card, that has this device tell the player by a notification when their friend has moved and it is their turn (it means nothing offline). Says nothing at all
 * where a browser cannot be sent notifications, and says why where the player has blocked them in it, which only they can undo.
 * The wrapper is always there, with the state on it, so a page and a spec can tell "still finding out" from "not offered".
 */
export function TurnNotifications(): React.JSX.Element {
  const {state, toggle} = useTurnNotifications();
  const offered = state === "off" || state === "on";

  return (
    <div
      data-testid="account-turn-notifications"
      data-state={state}
      className={clsx("flex flex-col gap-1", (state === "checking" || state === "unavailable") && "hidden")}
    >
      {offered && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-white/80">Tell me when it is my turn</span>

          <button
            type="button"
            role="switch"
            aria-checked={state === "on"}
            aria-label="Tell me when it is my turn"
            onClick={toggle}
            className={clsx(
              "h-8 w-16 shrink-0 cursor-pointer rounded-lg text-xs font-semibold transition-colors duration-150 motion-reduce:transition-none",
              state === "on" && "bg-wood text-ink",
              state !== "on" && "bg-black/25 text-white/60 hover:bg-white/10",
            )}
          >
            {state === "on" && "On"}
            {state !== "on" && "Off"}
          </button>
        </div>
      )}

      {state === "blocked" && (
        <p className="text-xs text-white/60">
          Notifications are blocked for Janggi in your browser&apos;s settings, so it cannot tell you when it is your
          turn.
        </p>
      )}
    </div>
  );
}

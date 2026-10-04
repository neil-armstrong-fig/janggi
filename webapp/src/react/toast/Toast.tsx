import {useAppSelector} from "@src/redux/Hooks";
import {useToastTimeout} from "@src/react/toast/hooks/use-toast-timeout/UseToastTimeout";

/**
 * A brief message that goes by itself, for explaining something the app just did that would otherwise look odd — a
 * tap that moved the player to another sheet, say. At the top of the screen, over the sheets, and it takes no tap, so
 * nothing under it is covered for more than a moment. What is shown is the `toast` slice's, and the timer is the hook's.
 */
export function Toast(): React.JSX.Element | null {
  const {message, id} = useAppSelector(state => state.toast);
  useToastTimeout(id, message !== undefined);

  if (message === undefined) return null;

  return (
    <div
      data-testid="toast"
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-2 top-[max(0.5rem,env(safe-area-inset-top))] z-50 mx-auto w-fit max-w-md rounded-2xl border border-gold/40 bg-ground-raised/95 px-4 py-2 text-center text-sm font-medium text-wood shadow-2xl shadow-black/40 backdrop-blur-sm"
    >
      {message}
    </div>
  );
}

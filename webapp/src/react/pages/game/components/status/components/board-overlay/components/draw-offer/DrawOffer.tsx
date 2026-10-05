import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

/**
 * Over the board while one player's offer of a draw waits for the other's answer — the question, and the
 * two buttons that answer it. See `docs/rules.md` §6.4.
 *
 * Only shown between two people sharing a device. Against the bot the answer comes from `useBotOpponent`
 * the moment the bot has weighed it, so there is nobody to ask.
 *
 * Only the buttons take a tap, and the board beneath stays open: a move played instead is an offer
 * withdrawn, which is what would happen across a real table.
 */
interface Props {
  readonly offeredBy: Side;
  readonly onAccept: () => void;
  readonly onDecline: () => void;
}

export function DrawOffer({offeredBy, onAccept, onDecline}: Props): React.JSX.Element {
  const {overlays} = useMessages();

  return (
    <div
      data-testid="draw-offer"
      data-offered-by={offeredBy}
      role="status"
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
    >
      <div className="rounded-2xl border border-wood/40 bg-ground/85 px-6 py-3 text-center shadow-2xl shadow-black backdrop-blur-sm">
        <p data-testid="draw-offer-line" className="text-sm font-semibold tracking-wide text-white/90">
          <span lang="ko" className="text-wood">
            무승부
          </span>{" "}
          · {overlays.drawOffer(offeredBy)}
        </p>

        <p className="mt-0.5 text-xs text-white/60">{overlays.drawOfferNote}</p>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            data-testid="draw-accept"
            onClick={onAccept}
            className="pointer-events-auto flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-wood px-5 text-sm font-semibold tracking-wide text-ink uppercase shadow transition-[transform,background-color] duration-150 hover:bg-wood/90 active:scale-[0.97] motion-reduce:transition-none"
          >
            <SvgIcon className="h-4 w-4">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </SvgIcon>
            {overlays.accept}
          </button>

          <button
            type="button"
            data-testid="draw-decline"
            onClick={onDecline}
            className="pointer-events-auto flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-white/10 px-5 text-sm font-semibold tracking-wide text-white/90 uppercase shadow transition-[transform,background-color] duration-150 hover:bg-white/15 active:scale-[0.97] motion-reduce:transition-none"
          >
            <SvgIcon className="h-4 w-4">
              <path d="M6 6l12 12M18 6 6 18" />
            </SvgIcon>
            {overlays.decline}
          </button>
        </div>
      </div>
    </div>
  );
}

import {ControlButton} from "@src/react/pages/game/components/status/components/controls/components/control-button/ControlButton";

/**
 * Offers the other army a draw — 합의 무승부, which friendly janggi allows and a tournament does not.
 * See `docs/rules.md` §6.4.
 *
 * A control rather than a gesture on the board, for the reason `PassButton` and `BikjangButton` are:
 * an offer moves nothing, so there is no intersection for it to be a tap on. What it opens is a
 * question — the other army may accept or decline — and only a yes ends the game.
 *
 * Disabled rather than hidden when there is no draw to offer, so the row does not reflow under a
 * thumb: in a scored game, which has no draw, for the whole of it, and in any game while an offer is
 * still waiting for its answer or once the game is over.
 */
interface Props {
  readonly enabled: boolean;
  readonly onOffer: () => void;
}

export function DrawButton({enabled, onOffer}: Props): React.JSX.Element {
  return <ControlButton testId="draw" label="Draw" icon={EQUAL} enabled={enabled} onPress={onOffer} />;
}

/** Two equal bars: nobody ahead. */
const EQUAL = <path d="M6 9h12M6 15h12" />;

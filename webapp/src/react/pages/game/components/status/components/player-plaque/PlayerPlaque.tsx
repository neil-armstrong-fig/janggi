import type {PieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceSetStyle";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlaqueState} from "@src/react/pages/game/components/status/types/PlaqueState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {clsx} from "clsx";
import {TakenTray} from "@src/react/pages/game/components/status/components/player-plaque/components/taken-tray/TakenTray";
import {sideName} from "@src/react/pages/game/utils/SideNames";
import {useRolledNumber} from "@src/react/pages/game/components/status/components/player-plaque/hooks/use-rolled-number/UseRolledNumber";

/**
 * One army's side of the frame: its name in its own colour, the pieces it has lost, and what it is
 * worth. Lit while the board is waiting on it, red while its general is attacked, gold once it has
 * won — so whose turn it is can be read from the edge of the eye without reading the herald at all.
 *
 * **The score is Han's 1.5 덤 folded in**, so the two figures are directly comparable — the whole
 * point of the half point being that they can never be equal. That is also why Han opens on 73.5
 * against Cho's 72 with nothing yet taken, which looks wrong for a moment and is exactly right. See
 * `docs/rules.md` §6.5. Each figure is its own element carrying `data-score`, which is what the
 * acceptance tests read rather than the words.
 *
 * With `animated`, a score counts down to its new value rather than jumping there, and a piece lost
 * pops into the tray. `data-score` is the true value throughout; only the words roll.
 *
 * Everything drawn here is handed in. Whose turn it is, the score and the losses are all derived by
 * `Status` from the position on each render; nothing here is stored.
 */
interface Props {
  readonly side: Side;
  readonly state: PlaqueState;
  readonly score: number;
  readonly taken: readonly PieceType[];
  readonly pieceStyle: PieceSetStyle;
  readonly animated: boolean;
}

export function PlayerPlaque({side, state, score, taken, pieceStyle, animated}: Props): React.JSX.Element {
  const shownScore = useRolledNumber(score, animated);

  return (
    <section
      data-testid={`plaque-${side}`}
      data-state={state}
      aria-label={sideName(side)}
      className={clsx(
        "flex h-11 shrink-0 items-center gap-2 rounded-xl border px-3 transition-[background-color,border-color,opacity] duration-300 motion-reduce:transition-none",
        FRAMES[state],
      )}
    >
      <span
        aria-hidden
        className={clsx("h-2.5 w-2.5 shrink-0 rounded-full", DOTS[side], !ON_TURN[state] && "opacity-25")}
      />

      <span className={clsx("shrink-0 text-sm font-semibold tracking-wide", NAMES[side])}>{sideName(side)}</span>

      <TakenTray side={side} taken={taken} pieceStyle={pieceStyle} popping={animated} />

      <span
        data-testid={`score-${side}`}
        data-score={score}
        className="ml-auto shrink-0 text-base font-semibold text-white/90 tabular-nums"
      >
        {shownScore}
      </span>
    </section>
  );
}

const FRAMES: Record<PlaqueState, string> = {
  waiting: "border-white/5 bg-white/[0.03] opacity-70",
  toMove: "border-wood/40 bg-white/10",
  layingOut: "border-dashed border-wood/50 bg-white/5",
  inCheck: "border-danger/70 bg-danger/15",
  won: "border-gold/70 bg-gold/15",
  lost: "border-white/5 bg-transparent opacity-50",
  drawn: "border-white/15 bg-white/5",
};

/** Whether the board is waiting on this army, which is what lights the dot beside its name. */
const ON_TURN: Record<PlaqueState, boolean> = {
  waiting: false,
  toMove: true,
  layingOut: true,
  inCheck: true,
  won: false,
  lost: false,
  drawn: false,
};

const NAMES: Record<Side, string> = {cho: "text-cho", han: "text-han"};

const DOTS: Record<Side, string> = {cho: "bg-cho", han: "bg-han"};

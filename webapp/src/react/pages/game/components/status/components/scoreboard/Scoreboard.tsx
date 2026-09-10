import type {GameState} from "@src/game/types/GameState";
import {scoreFor} from "@src/game/scoring/ScoreFor";
import {sideName} from "@src/react/pages/game/components/utils/SideNames";

/**
 * What each army is worth, which is what a game settles on when it stops without a checkmate.
 *
 * Han's 1.5 덤 is in the number rather than shown separately, so the two figures are directly
 * comparable — the whole point of the half point being that they can never be equal. That is also
 * why han opens on 73.5 against cho's 72 with nothing yet taken, which looks wrong for a moment and
 * is exactly right. See `docs/rules.md` §6.5.
 *
 * Derived on every render rather than stored: the board already says what is missing, and a second
 * copy of the total would be a thing to keep in step with it.
 */
interface Props {
  readonly game: GameState;
}

export function Scoreboard({game}: Props): React.JSX.Element {
  const cho = scoreFor(game, "cho");
  const han = scoreFor(game, "han");

  return (
    <p
      data-testid="scores"
      data-cho={cho}
      data-han={han}
      className="shrink-0 text-center text-[11px] tracking-wide text-white/40 tabular-nums uppercase"
    >
      {sideName("cho")} {cho} · {sideName("han")} {han}
    </p>
  );
}

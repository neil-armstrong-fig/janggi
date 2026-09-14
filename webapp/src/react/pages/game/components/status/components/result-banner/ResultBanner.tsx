import type {ArmyScores} from "@src/react/pages/game/components/status/types/ArmyScores";
import type {GameStatus} from "@src/react/pages/game/components/status/utils/GameStatusOf";
import {clsx} from "clsx";
import {sideName} from "@src/react/pages/game/utils/SideNames";
import type {Wording} from "@src/react/pages/game/components/status/components/result-banner/types/Wording";

/**
 * The end of a game, announced over the board: the result's name in Korean — 외통, 점수승, 빅장 — and
 * in plain English beneath it, with both scores where it was settled on points, and New game.
 *
 * Over the board rather than in the herald's line because it is the one moment everyone at the table
 * needs to take in at once. **New game is offered here** because the end of a game is exactly when a
 * player reaches for one, and the settings sheet is a long way to go looking for it; with the game
 * already over there is nothing a stray tap could abandon. Nothing else on the announcement takes a
 * tap, so the board beneath stays as it was left, and Undo is still there to step back out of the
 * ending — which takes the announcement away with it.
 *
 * With effects in full it slams in, over a single soft flash of the board. Otherwise it is simply there.
 */
interface Props {
  readonly status: GameStatus;
  readonly scores: ArmyScores;
  readonly animated: boolean;
  readonly onStartNewGame: () => void;
}

export function ResultBanner({status, scores, animated, onStartNewGame}: Props): React.JSX.Element | null {
  const wording = wordingOf(status);
  if (!wording) return null;

  return (
    <div
      data-testid="result"
      data-result={status.kind}
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
    >
      {animated && <span className="absolute inset-0 bg-white opacity-0 animate-[result-flash_600ms_ease-out_both]" />}

      <div
        className={clsx(
          "rounded-2xl border border-gold/50 bg-ground/85 px-6 py-3 text-center shadow-2xl shadow-black backdrop-blur-sm",
          animated && "animate-[result-slam_520ms_cubic-bezier(0.2,0.9,0.3,1.2)_both]",
        )}
      >
        <p lang="ko" className="text-3xl font-bold text-gold">
          {wording.korean}
        </p>

        <p className="mt-0.5 text-sm font-semibold tracking-wide text-white/90 uppercase">{wording.english}</p>

        {status.kind === "wonOnPoints" && (
          <p className="mt-1 text-xs text-white/60 tabular-nums">
            {sideName("cho")} {scores.cho} · {sideName("han")} {scores.han}
          </p>
        )}

        <button
          type="button"
          data-testid="result-new-game"
          onClick={onStartNewGame}
          className="pointer-events-auto mt-3 h-10 w-full cursor-pointer rounded-xl bg-wood px-5 text-sm font-semibold tracking-wide text-ink uppercase shadow transition-[transform,background-color] duration-150 hover:bg-wood/90 active:scale-[0.97] motion-reduce:transition-none"
        >
          New game
        </button>
      </div>
    </div>
  );
}

function wordingOf(status: GameStatus): Wording | undefined {
  switch (status.kind) {
    case "won":
      return {korean: "외통", english: `${sideName(status.by)} wins by checkmate`};
    case "wonOnPoints":
      return {korean: "점수승", english: `${sideName(status.by)} wins on points`};
    case "drawn":
      return {korean: "빅장", english: "Drawn by bikjang"};
    case "toMove":
    case "inCheck":
    case "layingOut":
      return undefined;
  }
}

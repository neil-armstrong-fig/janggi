import type {ArmyScores} from "@src/react/pages/game/components/status/components/board-overlay/types/ArmyScores";
import type {GameStatus} from "@src/react/pages/game/components/status/utils/GameStatusOf";
import type {Reward} from "@src/react/pages/game/components/status/components/board-overlay/types/Reward";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {clsx} from "clsx";
import {sideName} from "@src/react/pages/game/utils/SideNames";
import type {Wording} from "@src/react/pages/game/components/status/components/board-overlay/components/result-banner/types/Wording";

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
 * **A game ended by a called bikjang says what one is.** Chess has nothing like it, so to a player who
 * knows chess a game stopping on a call — the bot's, above all, which comes with no warning — looks like
 * the app giving up. The line names who called it and why the call was theirs to make.
 *
 * **A game against the bot says what it earned** — its XP, and anything that XP unlocked — since the end
 * of a game is when a player wants to know it, and the settings sheet is where they would otherwise
 * have to go and look. An unlock is a gold badge rather than another grey line, and with effects in full
 * it lands a beat after the result itself: the game is announced, and then what the game won you.
 *
 * With effects in full it slams in, over a single soft flash of the board. Otherwise it is simply there.
 */
interface Props {
  readonly status: GameStatus;
  readonly scores: ArmyScores;
  /** The army that called the bikjang that ended the game, or undefined where no bikjang ended it. */
  readonly bikjangCalledBy: Side | undefined;
  /** The army the bot is playing, so a call can be put in its mouth, or undefined between two people. */
  readonly botSide: Side | undefined;
  /** What the game earned, or undefined where it earned nothing. */
  readonly reward: Reward | undefined;
  readonly animated: boolean;
  readonly onStartNewGame: () => void;
}

export function ResultBanner({
  status,
  scores,
  bikjangCalledBy,
  botSide,
  reward,
  animated,
  onStartNewGame,
}: Props): React.JSX.Element | null {
  const wording = wordingOf(status);
  if (!wording) return null;

  return (
    <div
      data-testid="result"
      data-result={status.kind}
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center opacity-95 md:opacity-95"
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

        {bikjangCalledBy && (
          <p
            data-testid="result-explanation"
            data-called-by={bikjangCalledBy}
            className="mx-auto mt-2 max-w-64 text-xs leading-snug text-white/70"
          >
            {bikjangExplanationOf(status, bikjangCalledBy, botSide)}
          </p>
        )}

        {reward && (
          <p data-testid="result-xp" data-xp={reward.xp} className="mt-2 text-sm font-semibold text-gold tabular-nums">
            +{reward.xp} XP
          </p>
        )}

        {reward && reward.unlocked.length > 0 && (
          <p
            data-testid="result-unlocked"
            className={clsx(
              "mx-auto mt-2 w-fit rounded-full border border-gold/60 bg-gold/15 px-3 py-1 text-xs font-semibold tracking-wide text-gold",
              animated && "animate-[result-slam_520ms_cubic-bezier(0.2,0.9,0.3,1.2)_both] [animation-delay:340ms]",
            )}
          >
            🔓 Unlocked: {reward.unlocked.join(", ")}
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

/**
 * A called bikjang, told to someone who has never met one. What it settles is the format's to say —
 * `docs/rules.md` §6.2 — and the result's kind already carries that: a casual call draws, and a scored
 * one goes to the points.
 */
function bikjangExplanationOf(status: GameStatus, calledBy: Side, botSide: Side | undefined): string {
  const caller = calledBy === botSide ? `The bot, playing ${sideName(calledBy)},` : sideName(calledBy);
  const facing = "the two generals stood facing each other down an open file, with nothing between them.";

  if (status.kind === "drawn") {
    return `${caller} called bikjang: ${facing} Unlike chess, janggi lets the player to move call that a draw — so leaving the generals facing hands the other player the call.`;
  }

  return `${caller} called bikjang: ${facing} In a scored game that call ends the game, and it is settled on points.`;
}

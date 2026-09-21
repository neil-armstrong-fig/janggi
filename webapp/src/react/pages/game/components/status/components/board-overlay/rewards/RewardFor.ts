import type {GameResult} from "@src/redux/ratings/types/GameResult";
import type {GameStatus} from "@src/react/pages/game/components/status/utils/GameStatusOf";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Opponent} from "@src/redux/game/types/Opponent";
import type {Reward} from "@src/react/pages/game/components/status/components/board-overlay/types/Reward";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {unlockLadder} from "@src/redux/progress/unlocks/UnlockLadder";
import {xpFor} from "@src/redux/progress/xp/XpFor";

/**
 * What a decided game against the bot earned — its XP, and whatever that XP unlocked — or undefined for a
 * game still going, or one between two people, which earns nothing.
 *
 * Worked out from the result rather than stored beside it: the XP is the same `xpFor` that awarded it,
 * and what it unlocked is every rung between where the player stood before it and `xpNow`.
 */
export function rewardFor(
  status: GameStatus,
  opponent: Opponent,
  format: MatchFormat,
  xpNow: number,
): Reward | undefined {
  if (opponent.name !== "Bot") return undefined;

  const gameResult = resultOf(status, opponent.playerSide);
  if (!gameResult) return undefined;

  const xp = xpFor(format, gameResult);
  const unlocked = unlockLadder()
    .filter(step => step.xp > xpNow - xp && step.xp <= xpNow)
    .flatMap(step => step.labels);

  return {xp, unlocked};
}

function resultOf(status: GameStatus, playerSide: Side): GameResult | undefined {
  switch (status.kind) {
    case "won":
    case "wonOnPoints":
      return status.by === playerSide ? "won" : "lost";
    case "drawn":
      return "drawn";
    case "layingOut":
    case "toMove":
    case "inCheck":
      return undefined;
  }
}

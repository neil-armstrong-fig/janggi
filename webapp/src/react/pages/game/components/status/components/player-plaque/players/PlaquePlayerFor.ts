import type {Opponent} from "@src/redux/game/types/Opponent";
import type {PlaquePlayer} from "@src/react/pages/game/components/status/components/player-plaque/types/PlaquePlayer";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {unlockLadder} from "@src/redux/progress/unlocks/UnlockLadder";

/**
 * Who a plaque says is playing its army: against the bot, the bot at its strength, or the player at their
 * rating, their XP and what that XP is working towards; between two people at one device, nobody — both
 * armies are played at the same screen, and neither is rated.
 */
export function plaquePlayerFor(
  side: Side,
  opponent: Opponent,
  playerElo: number,
  xp: number,
): PlaquePlayer | undefined {
  if (opponent.name !== "Bot") return undefined;
  if (side !== opponent.playerSide) return {kind: "bot", elo: opponent.botElo};

  return {kind: "player", elo: playerElo, xp, nextUnlock: unlockLadder().find(step => step.xp > xp)};
}

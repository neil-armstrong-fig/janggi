import type {GameStatus} from "@src/react/pages/game/components/status/utils/GameStatusOf";
import type {PlaqueState} from "@src/react/pages/game/components/status/components/player-plaque/types/PlaqueState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * What the game's status comes to for one army's plaque.
 *
 * The herald says what the game is doing in words; the two plaques say it in light, each from its
 * own army's side — which is the same fact told twice, so it is read off the same `GameStatus`
 * rather than worked out again. A win is a win for one plaque and a loss for the other however it was
 * won, and a draw reads the same on both.
 */
export function plaqueStateOf(status: GameStatus, side: Side): PlaqueState {
  switch (status.kind) {
    case "layingOut":
      return status.side === side ? "layingOut" : "waiting";
    case "toMove":
      return status.side === side ? "toMove" : "waiting";
    case "inCheck":
      return status.side === side ? "inCheck" : "waiting";
    case "won":
    case "wonOnPoints":
      return status.by === side ? "won" : "lost";
    case "drawn":
      return "drawn";
  }
}

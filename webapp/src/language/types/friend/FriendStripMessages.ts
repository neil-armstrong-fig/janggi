import type {FriendConnectionStatus} from "@janggi/shared/janggi/online/FriendConnectionStatus";
import type {FriendGameState} from "@janggi/shared/janggi/online/FriendGameState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

export interface FriendStripMessages {
  readonly connection: Record<FriendConnectionStatus, string>;
  readonly states: Record<FriendGameState, string>;
  readonly youResigned: string;
  readonly opponentResigned: (name: string) => string;
  readonly friendResigned: string;
  readonly youAre: (side: Side) => string;
  readonly backToGame: string;
  readonly choose: string;
  readonly resign: string;
  readonly leave: string;
}

import type {GameShown} from "@janggi/shared/janggi/online/GameShown";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {OpponentName} from "@janggi/shared/janggi/settings/OpponentName";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {SideChoiceName} from "@janggi/shared/janggi/settings/SideChoiceName";

/** The Play tab: what each choice is called, and what each choice's options are. */
export interface PlayMessages {
  readonly games: string;
  readonly gameNames: Record<GameShown, string>;
  /** Said beside Online while it is the player's turn in the game with a friend. */
  readonly yourMove: string;
  readonly format: string;
  readonly formatNames: Record<MatchFormat, string>;
  readonly opponent: string;
  readonly opponentNames: Record<OpponentName, string>;
  readonly botStrength: string;
  readonly yourSide: string;
  readonly sideChoiceNames: Record<SideChoiceName, string>;
  readonly setup: string;
  /** What an army's own opening arrangement is called, as a heading. */
  readonly setupOf: (side: Side) => string;
  readonly setupNames: Record<SetupName, string>;
  readonly flipBoard: string;
  readonly newGame: string;
  readonly newGameCostsALoss: string;
}

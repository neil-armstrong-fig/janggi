import type {BotLock} from "@src/language/settings/play-messages/types/BotLock";
import type {ElephantPairing} from "@janggi/shared/janggi/settings/ElephantPairing";
import type {GameShown} from "@janggi/shared/janggi/online/GameShown";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {OpponentName} from "@janggi/shared/janggi/settings/OpponentName";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {SideChoiceName} from "@janggi/shared/janggi/settings/SideChoiceName";
import type {FormatSummaryMessages} from "@src/language/settings/play-messages/types/FormatSummaryMessages";

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
  /** What the setup line says for an army that has not laid out yet, as in a scored game waiting on Han. */
  readonly setupNotChosen: string;
  /** What an army's own opening arrangement is called, as a heading. */
  readonly setupOf: (side: Side) => string;
  readonly setupNames: Record<SetupName, string>;
  readonly flipBoard: string;
  readonly newGame: string;
  readonly newGameCostsALoss: string;
  readonly setupDescriptions: Record<SetupName, string>;
  readonly setupPickerLabel: (side: Side) => string;
  readonly armySwitchLabel: string;
  readonly botStrengthLabel: string;
  readonly yourSideLabel: string;
  readonly flipBoardHelp: string;
  readonly gamesLabel: string;
  readonly formatLabel: string;
  readonly opponentLabel: string;
  readonly botNeedsIsolation: string;
  readonly elephantPairings: Record<ElephantPairing, string>;
  readonly botLock: (lock: BotLock) => string;
  readonly formatExplanation: FormatExplanationMessages;
}

/** What sets the two match formats apart, and the one line that holds for both. */
interface FormatExplanationMessages {
  readonly casual: FormatSummaryMessages;
  readonly scored: FormatSummaryMessages;
  readonly both: string;
}

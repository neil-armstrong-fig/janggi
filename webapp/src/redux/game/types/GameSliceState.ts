import type {DrawOffer} from "@src/redux/game/types/DrawOffer";
import type {Opponent} from "@src/redux/game/types/Opponent";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {SetupPhase} from "@src/game/setups/types/SetupPhase";

/**
 * The game being played, and the phase it was laid out in.
 *
 * `phase` holds which of janggi's two games is being played and what each army has chosen — the
 * engine's `SetupPhase`, kept whole rather than unpacked into three fields, because the rule that
 * says who may choose next reads all three together. It is not a preference: the arrangements decide
 * the starting position and the format decides which game those pieces are playing. Each is settled
 * before play and each is *dealt* — changing one starts a fresh game rather than altering the one
 * under way.
 *
 * A phase can be half-finished, and that is the point. In a scored game Han lays out first and Cho
 * answers, so between those two acts `phase.choSetup` is `undefined` and `isArranged` is false;
 * `docs/rules.md` §6.6. A casual game is never held to that order, so it is dealt with both armies
 * already placed and never sits in that state at all.
 *
 * `played` is the whole record rather than a bare `GameState`, so the store holds where the game has
 * been as well as where it is. Everything that reads a position reads `played.present`. It exists
 * even while the board is still being laid out, because a board has to be drawn before it is
 * finished being arranged — see `BoardShownFor.ts`, which is the one place that stands in a default
 * for an army that has not chosen.
 *
 * `opponent` is who plays the other army — dealt like the format, for the same reason: a game against
 * the bot and a game between two people at one device are different games from the first move.
 *
 * What is *not* here is which point a player has tapped. That is UI state, it belongs to the
 * component that draws the board, and putting it in the store would make every highlight a
 * dispatch.
 */
export interface GameSliceState {
  readonly played: PlayedGame;
  readonly phase: SetupPhase;
  readonly opponent: Opponent;
  /**
   * Whether the player has let the bot make the game's first move — asked only where that move is the
   * bot's, and dealt false with every game. A game against the bot is rated from its first move, so a
   * bot that opened the moment a player chose Han would lock the settings under them and count their
   * next change of mind as a loss. `botAwaitsGoAhead` is the question this answers.
   */
  readonly botMayOpen: boolean;
  /**
   * The draw on offer, if one is — a question waiting for an answer, or a refusal the page says so of
   * until the game moves on. Dealt undefined with every game and never kept on the device: an offer
   * belongs to the moment it was made in. `DrawOffer` says why it is not in the record.
   */
  readonly drawOffer: DrawOffer | undefined;
}

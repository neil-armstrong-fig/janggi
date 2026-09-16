import type {Setup} from "@src/game/setups/types/Setup";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** The bot has its back rank to arrange — a scored game's 판차림, in the order the rules give. */
interface LayOut {
  readonly kind: "layOut";
  readonly side: Side;
  /** What Han has laid out, which a bot laying out Cho answers — undefined while Han has not. */
  readonly hanSetup: Setup | undefined;
}

/** The bot's army is to move. */
interface Play {
  readonly kind: "play";
}

/** What the bot is being waited on for. */
export type BotDuty = LayOut | Play;

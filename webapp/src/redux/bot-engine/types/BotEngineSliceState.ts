import type {BotEngineStatus} from "@src/redux/bot-engine/types/BotEngineStatus";

/**
 * How the bot's engine is doing. Not kept on the device: it says what this page has managed to start,
 * which a page opened tomorrow knows nothing about.
 */
export interface BotEngineSliceState {
  readonly status: BotEngineStatus;
  /** Why the engine failed, in words for the player — undefined in every other status. */
  readonly reason: string | undefined;
}

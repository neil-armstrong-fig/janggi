import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";

/** A bot strength as the picker shows it: the Elo as its name, and the Elo it stands for. */
export interface BotStrengthOption {
  readonly name: string;
  readonly elo: BotElo;
}

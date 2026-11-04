import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {SideChoiceName} from "@janggi/shared/janggi/settings/SideChoiceName";

/** What has to be beaten to open a locked bot strength: the rung beneath it, with the chosen army, in this format. */
export interface BotLock {
  readonly beneath: BotElo;
  readonly choice: SideChoiceName;
  readonly format: MatchFormat;
}

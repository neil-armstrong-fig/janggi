import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {SideRecord} from "@src/react/pages/game/components/record-sheet/types/SideRecord";

/** One row of the record: every game in one format against one strength of bot, and how each went. */
export interface RecordAgainstBot {
  readonly botElo: BotElo;
  readonly played: number;
  readonly won: number;
  readonly drawn: number;
  readonly lost: number;
  readonly asCho: SideRecord;
  readonly asHan: SideRecord;
}

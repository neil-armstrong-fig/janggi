import type {Search} from "@src/bot/engine/types/Search";
import type {SearchResult} from "@src/bot/engine/types/SearchResult";

/**
 * Something that can be asked for a move. Fairy-Stockfish in the browser is one; a test hands in a
 * fake, which is why everything above this line is written against the interface.
 */
export interface Engine {
  /** Searches one position. A search started while another runs stops that one first. */
  readonly search: (search: Search) => Promise<SearchResult>;

  /** Stops whatever is being searched, so a game dealt mid-thought does not receive the old answer. */
  readonly stop: () => void;
}

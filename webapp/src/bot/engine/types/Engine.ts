import type {Search} from "@src/bot/engine/types/Search";
import type {SearchResult} from "@src/bot/engine/types/SearchResult";

/**
 * Something that can be asked for a move. Fairy-Stockfish in the browser is one; a test hands in a
 * fake, which is why everything above this line is written against the interface.
 */
export interface Engine {
  /**
   * Brings the engine up, and resolves once it is ready for a search. Rejects if it cannot be started or
   * takes too long, and a later call then tries again rather than repeating the failure. Called while it is
   * already starting or started, it waits on that one.
   */
  readonly prepare: () => Promise<void>;

  /** Searches one position. A search started while another runs stops that one first. */
  readonly search: (search: Search) => Promise<SearchResult>;

  /** Stops whatever is being searched, so a game dealt mid-thought does not receive the old answer. */
  readonly stop: () => void;
}

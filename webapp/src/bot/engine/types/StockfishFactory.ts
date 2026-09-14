import type {StockfishModule} from "@src/bot/engine/types/StockfishModule";

/** Where the Emscripten build finds its own files, since they are not served beside the page. */
interface StockfishOptions {
  readonly locateFile: (file: string) => string;
  /** The script its threads load themselves from — each worker runs a copy of it. */
  readonly mainScriptUrlOrBlob: string;
}

/**
 * What `engine/stockfish.js` defines as the global `Stockfish` once it has loaded: a function that
 * boots the engine and resolves once it is ready for UCI.
 */
export type StockfishFactory = (options: StockfishOptions) => Promise<StockfishModule>;

declare global {
  var Stockfish: StockfishFactory | undefined;
}

import type {StockfishModule} from "@src/bot/engine/types/StockfishModule";

/**
 * How a running Fairy-Stockfish is come by, which is the one thing that differs between the page (a script
 * tag, threads loading themselves from beside it) and a test that plays whole games under Node (out of
 * `node_modules`). Called each time the engine is started, which is again after one has been given up on.
 */
export type EngineStarter = () => Promise<StockfishModule>;

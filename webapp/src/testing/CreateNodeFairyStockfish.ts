import type {Engine} from "@src/bot/engine/types/Engine";
import type {StockfishModule} from "@src/bot/engine/types/StockfishModule";
import {createRequire} from "node:module";
import {dirname, join} from "node:path";
import {fairyStockfishFrom} from "@src/bot/engine/FairyStockfishFrom";
import {readFileSync} from "node:fs";

/** What `fairy-stockfish-nnue.wasm` is handed to start under Node rather than in a page. */
interface NodeStockfishOptions {
  /**
   * The wasm itself, read and handed over rather than located. Node has a global `fetch`, and the
   * Emscripten loader takes that as leave to fetch the file — which it cannot do from a path.
   */
  readonly wasmBinary: Uint8Array;
  readonly locateFile: (file: string) => string;
  /** The script each of the engine's threads loads itself from. */
  readonly mainScriptUrlOrBlob: string;
}

/** What the package's `stockfish.js` exports when it is required under Node. */
type NodeStockfishFactory = (options: NodeStockfishOptions) => Promise<StockfishModule>;

/**
 * The same Fairy-Stockfish the page runs, started under Node — for a test that plays whole games against
 * the real engine rather than a fake one.
 *
 * Only the start differs from `createFairyStockfish`: the package's files are read out of `node_modules`
 * rather than served. The variant, the options and the conversation are `fairyStockfishFrom`, shared
 * with the page. Nothing in the app imports this, so it is never bundled.
 */
export function createNodeFairyStockfish(): Engine {
  return fairyStockfishFrom(startedUnderNode, THREADS);
}

function startedUnderNode(): Promise<StockfishModule> {
  const nodeRequire = createRequire(import.meta.url);
  const script = nodeRequire.resolve("fairy-stockfish-nnue.wasm/stockfish.js");
  const directory = dirname(script);
  const factory = nodeRequire(script) as NodeStockfishFactory;

  return factory({
    wasmBinary: readFileSync(join(directory, "stockfish.wasm")),
    locateFile: file => join(directory, file),
    mainScriptUrlOrBlob: script,
  });
}

/** Enough to run the threaded build as a phone would, without crowding the rest of a parallel test run. */
const THREADS = 2;

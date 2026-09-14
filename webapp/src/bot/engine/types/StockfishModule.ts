/** The part of Emscripten's in-memory file system the engine is handed its variant definition through. */
interface EngineFileSystem {
  readonly writeFile: (path: string, contents: string) => void;
}

/**
 * A running Fairy-Stockfish, as `fairy-stockfish-nnue.wasm` hands it back: UCI in by `postMessage`,
 * UCI out line by line to every listener.
 */
export interface StockfishModule {
  readonly postMessage: (command: string) => void;
  readonly addMessageListener: (listener: (line: string) => void) => void;
  readonly FS: EngineFileSystem;
}

import type {Engine} from "@src/bot/engine/types/Engine";
import type {StockfishModule} from "@src/bot/engine/types/StockfishModule";
import "@src/bot/engine/types/StockfishFactory";
import {fairyStockfishFrom} from "@src/bot/engine/FairyStockfishFrom";

/**
 * Fairy-Stockfish, run in the page from the files served at `engineUrl`.
 *
 * **Nothing is loaded until the first search**, which is when `fairyStockfishFrom` first starts the
 * engine — so a player who never picks the bot never downloads it. All that is particular to the page
 * is how the engine starts: its script loaded by tag, its threads loading themselves from beside it,
 * and as many of them as the device can spare. The conversation after that is `fairyStockfishFrom`'s.
 */
export function createFairyStockfish(engineUrl: string): Engine {
  return fairyStockfishFrom(() => startedInPage(engineUrl), threads());
}

async function startedInPage(engineUrl: string): Promise<StockfishModule> {
  await scriptLoaded(`${engineUrl}stockfish.js`);

  const factory = globalThis.Stockfish;
  if (!factory) throw new Error("The engine script loaded without defining Stockfish");

  return await factory({
    locateFile: file => `${engineUrl}${file}`,
    mainScriptUrlOrBlob: `${engineUrl}stockfish.js`,
  });
}

function scriptLoaded(source: string): Promise<void> {
  if (globalThis.Stockfish) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = source;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load the engine from ${source}`));
    document.head.append(script);
  });
}

/** Leave a core for the page itself, and stop at four — more buys a phone nothing but heat. */
function threads(): number {
  return Math.min(MOST_THREADS, Math.max(1, (navigator.hardwareConcurrency || 2) - 1));
}

const MOST_THREADS = 4;

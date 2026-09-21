import type {Engine} from "@src/bot/engine/types/Engine";
import type {StockfishModule} from "@src/bot/engine/types/StockfishModule";
import "@src/bot/engine/types/StockfishFactory";
import {FairyStockfish} from "@src/bot/engine/FairyStockfish";
import {reloadMayStillCome} from "@src/isolation/ReloadMayStillCome";

/**
 * Fairy-Stockfish, run in the page from the files served at `engineUrl`.
 *
 * **Nothing is loaded until the engine is prepared or first searched**, which is when
 * `FairyStockfish` first starts it — the page prepares it once the bot is the opponent, which the app
 * shipping against the bot makes most first visits. A player who has chosen a person to play never starts
 * it. All that is particular to the page is how the engine
 * starts: its script loaded by tag, its threads loading themselves from beside it, and as many of them as
 * the device can spare. The conversation after that is `FairyStockfish`'s.
 */
export function createFairyStockfish(engineUrl: string): Engine {
  return new FairyStockfish(() => startedInPage(engineUrl), threads());
}

async function startedInPage(engineUrl: string): Promise<StockfishModule> {
  if (!globalThis.crossOriginIsolated) return await notIsolated();

  await scriptLoaded(`${engineUrl}stockfish.js`);

  const factory = globalThis.Stockfish;
  if (!factory) throw new Error("The engine script loaded without defining Stockfish");

  return await factory({
    locateFile: file => `${engineUrl}${file}`,
    mainScriptUrlOrBlob: `${engineUrl}stockfish.js`,
  });
}

/**
 * The engine's threads share memory with the page, which a page that is not cross-origin isolated may not
 * do — they would only hang. Where the service worker may yet take the page over and reload it, wait for
 * that: the reload replaces this page, and calling the engine unavailable a moment before it would be
 * wrong. Where none is coming, say so, and how to put it right.
 */
function notIsolated(): Promise<never> {
  if (reloadMayStillCome()) return new Promise<never>(() => undefined);

  return Promise.reject(
    new Error("This page is not cross-origin isolated, which the bot's engine needs. Reload the page to try again."),
  );
}

function scriptLoaded(source: string): Promise<void> {
  if (globalThis.Stockfish) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = source;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      reject(new Error(`Failed to load the engine from ${source}`));
    };
    document.head.append(script);
  });
}

/** Leave a core for the page itself, and stop at four — more buys a phone nothing but heat. */
function threads(): number {
  return Math.min(MOST_THREADS, Math.max(1, (navigator.hardwareConcurrency || 2) - 1));
}

const MOST_THREADS = 4;

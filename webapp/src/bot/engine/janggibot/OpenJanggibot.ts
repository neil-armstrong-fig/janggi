import type {UciConversation} from "@src/bot/engine/conversation/UciConversation";

/**
 * Brings a running engine up as `janggibot` — Fairy-Stockfish's `janggi` with its automatic bikjang
 * turned off — at reduced strength, on `threads` threads, and resolves once it says it is ready.
 *
 * Defining the variant is what makes the engine's janggi the nearest it comes to ours (`docs/bot.md`), so
 * it is done once per engine, before anything is asked of it; every search after that reuses it.
 */
export async function openJanggibot(conversation: UciConversation, threads: number): Promise<void> {
  conversation.writeFile(VARIANT_PATH, VARIANT);
  await conversation.sendAndAwait("uci", "uciok");

  conversation.send(`setoption name VariantPath value ${VARIANT_PATH}`);
  conversation.send("setoption name UCI_Variant value janggibot");
  conversation.send(`setoption name Threads value ${threads}`);
  conversation.send("setoption name UCI_LimitStrength value true");
  await conversation.sendAndAwait("isready", "readyok");
}

const VARIANT_PATH = "/janggibot.ini";

/**
 * Fairy-Stockfish's `janggi` with its automatic bikjang turned off. Our bikjang is *called*, and the bot
 * decides when to call one itself; left on, the engine would treat facing generals as ending the game
 * and forbid moves our rules allow. Material counting stays on, so two passes in a row are a points
 * decision — as they are here in both formats.
 */
const VARIANT = "[janggibot:janggi]\nbikjangRule = false\nmaterialCounting = janggi\n";

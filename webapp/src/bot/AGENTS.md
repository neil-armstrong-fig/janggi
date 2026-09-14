# AGENTS.md — the bot

`src/bot/` decides the bot's turn: a position in, what to play out. Fairy-Stockfish chooses the move;
**our engine decides what it may choose from**. `docs/bot.md` is why — read it before changing anything
about what the engine is asked, because its janggi is not ours.

It may import `src/game/` and `@janggi/shared`, and nothing of the store, the page or the sound. The
page decides when to ask; nothing in here knows about React or Redux (a lint rule).

## Layout

```
BotTurnFor.ts          botTurnFor(engine, played, elo, evaluation): Promise<BotDecision> — the whole turn

choice/                what the bot may play, and when it calls a bikjang — plain functions
notation/              positions and moves in the engine's spelling: FEN, UCI squares, the history
engine/                Fairy-Stockfish, behind the `Engine` interface
  FairyStockfishFrom.ts     the UCI conversation, however the engine was started; one search at a time
  CreateFairyStockfish.ts   starts it in the page, on the first search
  uci-lines/                reading its output
levels/                how long it thinks at each Elo
```

## Conventions particular to here

- **The engine is only ever handed `candidateTurnsFor`.** Never ask it an open `go`: it would answer with
  moves our rules refuse — a third repetition above 30 points, or keeping a bikjang it thinks is forced.
- **Its answer is matched, not parsed and trusted.** `botTurnFor` looks the `bestmove` up in the list it
  offered; anything else falls back to a legal candidate.
- **Everything above `engine/` is tested against a fake `Engine`,** a turn at a time. The real engine is
  played by one test only — `pages/game/PlayingTheBotToTheEnd.test.ts`, which plays whole games on it —
  started under Node by `src/testing/CreateNodeFairyStockfish.ts`. Only the start differs from the
  page's: both hand `fairyStockfishFrom` a way to start the engine, so the conversation that test holds
  is the page's own rather than a copy of it.
- **Ranks count up from Cho's edge in the engine's notation**, the opposite of `docs/rules.md` §1:
  `squares/SquareOf.ts` is the one place that turns round.

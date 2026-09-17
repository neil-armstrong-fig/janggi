import {hangulPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hangul/HangulPieces";
import {modernPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/modern/ModernPieces";
import {PieceCard} from "@src/react/pages/learn/components/pieces/components/piece-card/PieceCard";
import {traditionalPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/traditional/TraditionalPieces";
import {useState} from "react";

export function Pieces(): React.JSX.Element {
  const [pieceStyle, setPieceStyle] = useState(traditionalPieces);

  return (
    <section id="pieces" className="scroll-mt-4 border-t border-wood/15 py-16 lg:py-28" data-testid="guide-section">
      <p className="mb-3 text-xs font-bold tracking-[0.19em] text-gold uppercase">03 · Seven kinds of piece</p>

      <h2 className="mb-7 font-serif text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
        How the pieces move
      </h2>

      <p className="mb-8 max-w-2xl text-lg leading-relaxed text-wood/75">
        Every piece captures the same way it normally moves. A piece may never land on a point occupied by its own army.
        Tap a piece below to see its movement on a small board.
      </p>

      <div className="mb-4 flex flex-col items-start justify-between gap-3 text-sm font-bold text-wood/70 sm:flex-row sm:items-center">
        <span>Piece style</span>

        <div
          className="flex w-full gap-1 rounded-lg bg-black/20 p-1 sm:w-auto"
          role="group"
          aria-label="Choose how the example pieces look"
        >
          <button
            className="min-h-10 flex-1 cursor-pointer rounded-md px-3 py-2 aria-pressed:bg-gold aria-pressed:text-ink"
            type="button"
            data-testid="guide-piece-style-traditional"
            aria-pressed={pieceStyle.name === traditionalPieces.name}
            onClick={() => setPieceStyle(traditionalPieces)}
          >
            Traditional
          </button>

          <button
            className="min-h-10 flex-1 cursor-pointer rounded-md px-3 py-2 aria-pressed:bg-gold aria-pressed:text-ink"
            type="button"
            data-testid="guide-piece-style-hangul"
            aria-pressed={pieceStyle.name === hangulPieces.name}
            onClick={() => setPieceStyle(hangulPieces)}
          >
            Hangul
          </button>

          <button
            className="min-h-10 flex-1 cursor-pointer rounded-md px-3 py-2 aria-pressed:bg-gold aria-pressed:text-ink"
            type="button"
            data-testid="guide-piece-style-modern"
            aria-pressed={pieceStyle.name === modernPieces.name}
            onClick={() => setPieceStyle(modernPieces)}
          >
            Modern
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <PieceCard
          pieceType="general"
          pieceStyle={pieceStyle}
          name="General"
          mark="궁 · 장"
          description="Moves one point along any drawn line and may never leave its own palace. Checkmate this piece to win."
        />

        <PieceCard
          pieceType="guard"
          pieceStyle={pieceStyle}
          name="Guard"
          mark="사"
          description="Moves exactly like the general: one point along a line, always inside its own palace."
        />

        <PieceCard
          pieceType="chariot"
          pieceStyle={pieceStyle}
          name="Chariot"
          mark="차"
          description="Moves any distance horizontally or vertically, or along a straight palace diagonal, until blocked."
        />

        <PieceCard
          pieceType="cannon"
          pieceStyle={pieceStyle}
          name="Cannon"
          mark="포"
          description="Moves like a chariot after jumping exactly one piece. That piece cannot be another cannon, and a cannon cannot capture a cannon."
        />

        <PieceCard
          pieceType="horse"
          pieceStyle={pieceStyle}
          name="Horse"
          mark="마"
          description="Steps one point straight, then one diagonally outward. Any piece on the first point blocks it."
        />

        <PieceCard
          pieceType="elephant"
          pieceStyle={pieceStyle}
          name="Elephant"
          mark="상"
          description="Steps one point straight, then two diagonally outward. Either point on its route can block it."
        />

        <PieceCard
          pieceType="soldier"
          pieceStyle={pieceStyle}
          name="Soldier"
          mark="졸 · 병"
          description="Steps one point forward or sideways, never back. In the enemy palace it can also follow a forward diagonal."
        />
      </div>

      <div className="mt-4 border-l-3 border-gold bg-gold/5 px-5 py-4 text-wood/80" aria-label="Janggi piece values">
        <p>
          <strong>Traditional values:</strong> chariot 13 · cannon 7 · horse 5 · elephant 3 · guard 3 · soldier 2
        </p>
      </div>

      <p className="mt-4 border-l-3 border-gold bg-gold/5 px-5 py-4 text-wood/80">
        Movement and values are based on the{" "}
        <a
          className="underline decoration-wood/35 underline-offset-4 hover:decoration-gold"
          href="https://web.archive.org/web/2013/http://kja.or.kr/janggi_intro/c.php"
        >
          Korea Janggi Association’s piece rules
        </a>
        . The{" "}
        <a
          className="underline decoration-wood/35 underline-offset-4 hover:decoration-gold"
          data-testid="guide-rules-source"
          href="https://github.com/neil-armstrong-fig/janggi/blob/main/docs/rules.md"
        >
          rules research for this game
        </a>{" "}
        records the translations, comparisons and decisions behind this summary.
      </p>
    </section>
  );
}

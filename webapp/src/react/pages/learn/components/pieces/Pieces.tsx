import type {GuidePiecesMessages} from "@src/language/guide/guide-pieces-messages/GuidePiecesMessages";
import {hangulPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hangul/HangulPieces";
import {modernPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/modern/ModernPieces";
import {PieceCard} from "@src/react/pages/learn/components/pieces/components/piece-card/PieceCard";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import {traditionalPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/traditional/TraditionalPieces";
import {useState} from "react";

interface Props {
  readonly messages: GuidePiecesMessages;
}

/** The order the cards are laid out in, which is the order a player meets them rather than the order of the types. */
const CARD_ORDER: readonly PieceType[] = ["general", "guard", "chariot", "cannon", "horse", "elephant", "soldier"];

export function Pieces({messages}: Props): React.JSX.Element {
  const [pieceStyle, setPieceStyle] = useState(traditionalPieces);

  return (
    <section id="pieces" className="scroll-mt-4 border-t border-wood/15 py-16 lg:py-28" data-testid="guide-section">
      <p className="mb-3 text-xs font-bold tracking-[0.19em] text-gold uppercase">{messages.eyebrow}</p>

      <h2 className="mb-7 font-serif text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
        {messages.heading}
      </h2>

      <p className="mb-8 max-w-2xl text-lg leading-relaxed text-wood/75">{messages.introduction}</p>

      <div className="mb-4 flex flex-col items-start justify-between gap-3 text-sm font-bold text-wood/70 sm:flex-row sm:items-center">
        <span>{messages.styleLabel}</span>

        <div
          className="flex w-full gap-1 rounded-lg bg-black/20 p-1 sm:w-auto"
          role="group"
          aria-label={messages.styleGroupLabel}
        >
          <button
            className="min-h-10 flex-1 cursor-pointer rounded-md px-3 py-2 aria-pressed:bg-gold aria-pressed:text-ink"
            type="button"
            data-testid="guide-piece-style-traditional"
            aria-pressed={pieceStyle.name === traditionalPieces.name}
            onClick={() => setPieceStyle(traditionalPieces)}
          >
            {messages.styles.traditional}
          </button>

          <button
            className="min-h-10 flex-1 cursor-pointer rounded-md px-3 py-2 aria-pressed:bg-gold aria-pressed:text-ink"
            type="button"
            data-testid="guide-piece-style-hangul"
            aria-pressed={pieceStyle.name === hangulPieces.name}
            onClick={() => setPieceStyle(hangulPieces)}
          >
            {messages.styles.hangul}
          </button>

          <button
            className="min-h-10 flex-1 cursor-pointer rounded-md px-3 py-2 aria-pressed:bg-gold aria-pressed:text-ink"
            type="button"
            data-testid="guide-piece-style-modern"
            aria-pressed={pieceStyle.name === modernPieces.name}
            onClick={() => setPieceStyle(modernPieces)}
          >
            {messages.styles.modern}
          </button>
        </div>
      </div>

      <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARD_ORDER.map(pieceType => (
          <PieceCard
            key={pieceType}
            pieceType={pieceType}
            pieceStyle={pieceStyle}
            messages={messages.pieces[pieceType]}
            blockerName={messages.pieces.soldier.name}
          />
        ))}
      </div>

      <div className="mt-4 border-l-3 border-gold bg-gold/5 px-5 py-4 text-wood/80" aria-label={messages.valuesLabel}>
        <p>
          {messages.values.before}
          <strong>{messages.values.marked}</strong>
          {messages.values.after}
        </p>
      </div>

      <p className="mt-4 border-l-3 border-gold bg-gold/5 px-5 py-4 text-wood/80">
        {messages.sources.start}
        <a
          className="underline decoration-wood/35 underline-offset-4 hover:decoration-gold"
          href="https://web.archive.org/web/2013/http://kja.or.kr/janggi_intro/c.php"
        >
          {messages.sources.firstLink}
        </a>
        {messages.sources.middle}
        <a
          className="underline decoration-wood/35 underline-offset-4 hover:decoration-gold"
          data-testid="guide-rules-source"
          href="https://github.com/neil-armstrong-fig/janggi/blob/main/docs/rules.md"
        >
          {messages.sources.secondLink}
        </a>
        {messages.sources.end}
      </p>
    </section>
  );
}

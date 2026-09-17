import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import {MovementSnapshot} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/MovementSnapshot";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";

interface Props {
  readonly pieceType: PieceType;
  readonly pieceStyle: PieceSetStyle;
  readonly name: string;
  readonly mark: string;
  readonly description: string;
}

export function PieceCard({pieceType, pieceStyle, name, mark, description}: Props): React.JSX.Element {
  return (
    <details
      className="group rounded-xl border border-wood/15 bg-ground-raised/60"
      data-testid={`guide-piece-${pieceType}`}
    >
      <summary className="relative block min-h-0 cursor-pointer list-none p-6 pr-12 after:absolute after:top-5 after:right-5 after:text-2xl after:font-normal after:leading-none after:text-gold after:content-['+'] group-open:border-b group-open:border-wood/10 group-open:after:content-['−'] sm:min-h-40 [&::-webkit-details-marker]:hidden">
        <span className="mb-2 block text-base font-bold">
          {name} <span className="ml-1 text-sm font-semibold text-gold">{mark}</span>
        </span>

        <span className="block text-sm leading-relaxed text-wood/70">{description}</span>
      </summary>

      <MovementSnapshot pieceType={pieceType} pieceStyle={pieceStyle} />
    </details>
  );
}

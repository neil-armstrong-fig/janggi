/**
 * 빅장, small, on a move that would leave the opponent a bikjang to call — the word a player already
 * knows from the button that calls one, so it needs no key to read.
 *
 * Text rather than a colour or another ring because every ring here already means something — white a
 * move, dashed a point covered, red a check — and a colour is one more thing to lose against whichever
 * board is in use. Dark on the hint's own white, so it reads on pale wood and near-black alike.
 *
 * `MoveHint` decides where it sits: inside the dot of an empty point, and on a pill of its own over a
 * piece the move would take, where there is no dot to hold it.
 */
export function BikjangLabel(): React.JSX.Element {
  return (
    <span data-testid="bikjang-risk" className="text-[10px] leading-none font-bold text-black/75">
      빅장
    </span>
  );
}

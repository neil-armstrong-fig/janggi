import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {CustomStyleRow} from "@src/react/pages/game/components/styles-sheet/components/custom-style-row/CustomStyleRow";
import {SectionHeading} from "@src/react/pages/game/components/styles-sheet/components/section-heading/SectionHeading";
import {boardStyleDeleted, pieceSetDeleted} from "@src/redux/custom-styles/CustomStylesSlice";
import {encodeKey} from "@janggi/shared/janggi/share-keys/EncodeKey";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";

/**
 * The player's own board styles and piece sets, each with a key to share it by and a way to delete it. Any
 * number of either may be kept; a style saved under the name of one of these replaces it.
 */
export function OwnStyles(): React.JSX.Element {
  const words = useMessages().styles.ownStyles;
  const customStyles = useAppSelector(state => state.customStyles);
  const dispatch = useAppDispatch();

  const hasNone = customStyles.boards.length === 0 && customStyles.pieceSets.length === 0;

  return (
    <section aria-label={words.label} className="flex flex-col gap-2">
      <SectionHeading>{words.heading}</SectionHeading>

      {hasNone && <p className="text-sm text-white/60">{words.none}</p>}

      {!hasNone && (
        <ul className="flex flex-col gap-2">
          {customStyles.boards.map(boardStyle => (
            <CustomStyleRow
              key={`board-${boardStyle.name}`}
              kind="Board"
              name={boardStyle.name}
              keyOf={() => encodeKey("board", boardStyle)}
              onDelete={() => dispatch(boardStyleDeleted(boardStyle.name))}
            />
          ))}

          {customStyles.pieceSets.map(pieceSetStyle => (
            <CustomStyleRow
              key={`pieces-${pieceSetStyle.name}`}
              kind="Pieces"
              name={pieceSetStyle.name}
              keyOf={() => encodeKey("pieces", pieceSetStyle)}
              onDelete={() => dispatch(pieceSetDeleted(pieceSetStyle.name))}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

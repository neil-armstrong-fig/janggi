import type {BoardStyle} from "@src/react/pages/game/components/board/cell-styles/types/BoardStyle";
import {StyleButton} from "@src/react/pages/game/components/style-picker/components/style-button/StyleButton";

/**
 * Scaffolding for the prototype: somewhere to see that a board is nothing but the styles its cells
 * are given. A real settings screen replaces it.
 */
interface Props {
  readonly styles: readonly BoardStyle[];
  readonly selected: BoardStyle;
  readonly onSelect: (style: BoardStyle) => void;
}

export function StylePicker({styles, selected, onSelect}: Props): React.JSX.Element {
  return (
    <nav data-testid="style-picker" className="flex shrink-0 items-center justify-center gap-2">
      {styles.map(style => (
        <StyleButton key={style.name} style={style} selected={style.name === selected.name} onSelect={onSelect} />
      ))}
    </nav>
  );
}

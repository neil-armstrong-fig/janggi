import type {BoardStyle} from "@src/react/pages/game/components/board/cell-styles/types/BoardStyle";

/** One option in the picker: the style's name, pressed when it is the one on the board. */
interface Props {
  readonly style: BoardStyle;
  readonly selected: boolean;
  readonly onSelect: (style: BoardStyle) => void;
}

export function StyleButton({style, selected, onSelect}: Props): React.JSX.Element {
  return (
    <button
      type="button"
      data-testid={`style-option-${style.name.toLowerCase()}`}
      aria-pressed={selected}
      onClick={() => onSelect(style)}
      className={`rounded-full px-4 py-2 text-sm font-medium ${
        selected ? "bg-[#e7c88f] text-[#1c140b]" : "bg-white/10 text-white/70"
      }`}
    >
      {style.name}
    </button>
  );
}

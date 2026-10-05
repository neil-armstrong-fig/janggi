import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";
import type {IconProps} from "@src/react/pages/game/components/svg-icon/types/IconProps";

export function UndoIcon({className}: IconProps): React.JSX.Element {
  return (
    <SvgIcon className={className}>
      <path d="M9 14 4 9l5-5" />

      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </SvgIcon>
  );
}

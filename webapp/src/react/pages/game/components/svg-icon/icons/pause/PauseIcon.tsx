import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";
import type {IconProps} from "@src/react/pages/game/components/svg-icon/types/IconProps";

export function PauseIcon({className}: IconProps): React.JSX.Element {
  return (
    <SvgIcon className={className}>
      <path d="M9 6v12M15 6v12" />
    </SvgIcon>
  );
}

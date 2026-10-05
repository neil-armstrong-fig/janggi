import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";
import type {IconProps} from "@src/react/pages/game/components/svg-icon/types/IconProps";

export function PlayIcon({className}: IconProps): React.JSX.Element {
  return (
    <SvgIcon className={className}>
      <path d="M7 4.5v15l12-7.5z" />
    </SvgIcon>
  );
}

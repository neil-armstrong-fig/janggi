import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";
import type {IconProps} from "@src/react/pages/game/components/svg-icon/types/IconProps";

export function PersonIcon({className}: IconProps): React.JSX.Element {
  return (
    <SvgIcon className={className}>
      <circle cx="12" cy="8" r="3.5" />

      <path d="M5 20c0-3.9 3.1-6 7-6s7 2.1 7 6" />
    </SvgIcon>
  );
}

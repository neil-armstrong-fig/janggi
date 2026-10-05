import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";
import type {IconProps} from "@src/react/pages/game/components/svg-icon/types/IconProps";

export function CopyIcon({className}: IconProps): React.JSX.Element {
  return (
    <SvgIcon className={className}>
      <rect x="9" y="9" width="11" height="11" rx="2" />

      <path d="M5 15V6a2 2 0 0 1 2-2h8" />
    </SvgIcon>
  );
}

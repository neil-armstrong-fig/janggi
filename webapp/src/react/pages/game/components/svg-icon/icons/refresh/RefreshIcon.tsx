import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";
import type {IconProps} from "@src/react/pages/game/components/svg-icon/types/IconProps";

export function RefreshIcon({className}: IconProps): React.JSX.Element {
  return (
    <SvgIcon className={className}>
      <path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v5h-5" />
    </SvgIcon>
  );
}

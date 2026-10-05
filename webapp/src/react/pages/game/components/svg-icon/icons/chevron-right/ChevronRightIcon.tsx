import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";
import type {IconProps} from "@src/react/pages/game/components/svg-icon/types/IconProps";

export function ChevronRightIcon({className}: IconProps): React.JSX.Element {
  return (
    <SvgIcon className={className}>
      <path d="M9 6l6 6-6 6" />
    </SvgIcon>
  );
}

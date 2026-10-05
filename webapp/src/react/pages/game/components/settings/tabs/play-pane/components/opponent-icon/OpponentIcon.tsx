import type {OpponentName} from "@janggi/shared/janggi/settings/OpponentName";
import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";

/** A head and shoulders for someone at the same device, and a robot's head for the bot. */
interface Props {
  readonly name: OpponentName;
}

export function OpponentIcon({name}: Props): React.JSX.Element {
  return <SvgIcon className="h-4 w-4">{GLYPHS[name]}</SvgIcon>;
}

const GLYPHS: Record<OpponentName, React.ReactNode> = {
  Human: (
    <>
      <circle cx="12" cy="8" r="3.5" />

      <path d="M5 20c0-3.9 3.1-6 7-6s7 2.1 7 6" />
    </>
  ),
  Bot: (
    <>
      <rect x="4" y="8" width="16" height="11" rx="2.5" />

      <path d="M12 8V4.5M9 13v.5M15 13v.5" />
    </>
  ),
};

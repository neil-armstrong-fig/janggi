import type {CheckStyle} from "@src/styles/types/board-marks/CheckStyle";
import type {ThreatRole} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/threat-mark/types/ThreatRole";
import {clsx} from "clsx";
import {tintOf} from "@src/react/pages/game/components/board/utils/TintOf";

/**
 * The mark on a point in a check: a filled red ring round the general under attack, and a thinner red
 * ring round each piece attacking it — so which general, and from where, is read off the board without
 * tracing a single line of attack.
 *
 * Under the piece, and in its own square for the reason `MovableMark` gives. While the board may move,
 * the general's ring beats like a pulse; otherwise it is simply there, being a mark rather than motion.
 */
interface Props {
  readonly role: ThreatRole;
  /** How the board's style draws a check. */
  readonly checkStyle: CheckStyle;
  readonly pulsing: boolean;
}

export function ThreatMark({role, checkStyle, pulsing}: Props): React.JSX.Element {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span
        className={clsx(
          "block h-[96%] rounded-full",
          ROLES[role],
          pulsing && role === "underAttack" && "animate-[danger-pulse_1.1s_ease-in-out_infinite]",
        )}
        style={{aspectRatio: 1, ...RINGS[role](checkStyle.colour)}}
      />
    </span>
  );
}

const ROLES: Record<ThreatRole, string> = {
  underAttack: "border-[3px]",
  attacking: "border-2",
};

/** The ring's colours, in the board's own colour for a check: full round the general, quieter round an attacker. */
const RINGS: Record<ThreatRole, (colour: string) => React.CSSProperties> = {
  underAttack: colour => ({borderColor: colour, background: tintOf(colour, 25)}),
  attacking: colour => ({borderColor: tintOf(colour, 80)}),
};

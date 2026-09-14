import type {ThreatRole} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/threat-mark/types/ThreatRole";
import {clsx} from "clsx";

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
  readonly pulsing: boolean;
}

export function ThreatMark({role, pulsing}: Props): React.JSX.Element {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span
        className={clsx(
          "block h-[96%] rounded-full",
          ROLES[role],
          pulsing && role === "underAttack" && "animate-[danger-pulse_1.1s_ease-in-out_infinite]",
        )}
        style={{aspectRatio: 1}}
      />
    </span>
  );
}

const ROLES: Record<ThreatRole, string> = {
  underAttack: "border-[3px] border-danger bg-danger/25",
  attacking: "border-2 border-danger/80",
};

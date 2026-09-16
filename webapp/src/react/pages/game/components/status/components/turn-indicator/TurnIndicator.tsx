import type {GameStatus} from "@src/react/pages/game/components/status/utils/GameStatusOf";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {clsx} from "clsx";
import {sideName} from "@src/react/pages/game/utils/SideNames";
import {useGameStatus} from "@src/react/pages/game/components/status/hooks/use-game-status/UseGameStatus";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";

/**
 * The herald: whose turn it is, whether their general is under attack, and how the game ended — a
 * checkmate, a win on points once both players have rested a turn, or a draw where a bikjang was
 * called.
 *
 * Without it a board waiting for the other army is indistinguishable from one that has stopped
 * responding: your own pieces simply refuse to be picked up and nothing says why. A mate is the
 * sharper case of the same thing — every piece refuses at once, and only this line says the game is
 * over rather than broken. The plaques say the same thing in light; this says it in words.
 *
 * Tinted by what it announces: the colour of the army to move, red for a check, gold for a result. While
 * the game waits on the bot it says so, in words and in `data-bot-to-move` — the attribute a spec waits on
 * to know the bot has played. With effects in full the words give a small bump each time they change.
 *
 * It reads the game for itself, through `useGameStatus`, and is handed nothing.
 *
 * The attributes rather than the text are the contract with the acceptance tests, so the wording can
 * change without breaking a spec. `aria-live` is what makes the turn passing an announcement rather
 * than a silent change to a line nobody is looking at.
 */
export function TurnIndicator(): React.JSX.Element {
  const {status, botsTurn, awaitingGoAhead} = useGameStatus();
  const {effects} = usePreferences();

  const botToMove = botsTurn && !awaitingGoAhead;
  const winner = winnerOf(status);
  const announcement = botToMove ? botAnnouncementOf(status) : announcementOf(status);

  return (
    <p
      data-testid="turn"
      data-side={winner ?? sideOf(status)}
      data-bot-to-move={botToMove ? "" : undefined}
      data-laying-out={status.kind === "layingOut" ? "" : undefined}
      data-in-check={status.kind === "inCheck" ? "" : undefined}
      data-drawn={status.kind === "drawn" ? "" : undefined}
      data-winner={winner}
      aria-live="polite"
      className={clsx(
        "h-6 shrink-0 self-center rounded-full px-3 text-center text-xs leading-6 font-semibold tracking-wide uppercase transition-colors duration-300 motion-reduce:transition-none",
        toneOf(status),
      )}
    >
      {/* Keyed by the words, so each new announcement bumps from the start; the live region itself
          stays put, so a screen reader still hears it. */}
      <span
        key={announcement}
        className={clsx("inline-block", effects.full && "animate-[herald-bump_320ms_ease-out_both]")}
      >
        {announcement}
      </span>
    </p>
  );
}

function botAnnouncementOf(status: GameStatus): string {
  return status.kind === "layingOut" ? "Bot is laying out" : "Bot is thinking";
}

function announcementOf(status: GameStatus): string {
  switch (status.kind) {
    case "won":
      return `${sideName(status.by)} wins`;
    case "wonOnPoints":
      return `${sideName(status.by)} wins on points`;
    case "drawn":
      return "Drawn by bikjang";
    case "inCheck":
      return `${sideName(status.side)} is in check`;
    case "toMove":
      return `${sideName(status.side)} to move`;
    case "layingOut":
      return `${sideName(status.side)} to lay out`;
  }
}

function toneOf(status: GameStatus): string {
  switch (status.kind) {
    case "won":
    case "wonOnPoints":
      return "bg-gold/15 text-gold";
    case "drawn":
      return "bg-white/10 text-white/80";
    case "inCheck":
      return "bg-danger/20 text-danger";
    case "toMove":
      return SIDE_TONES[status.side];
    case "layingOut":
      return "bg-wood/15 text-wood";
  }
}

const SIDE_TONES: Record<Side, string> = {cho: "bg-cho/15 text-cho", han: "bg-han/15 text-han"};

/** The army that has won, however it won, or undefined while there is still a game to play. */
function winnerOf(status: GameStatus): Side | undefined {
  if (status.kind === "won" || status.kind === "wonOnPoints") return status.by;

  return undefined;
}

/** The army the line is about while there is no result yet — the one to move, or to lay out. */
function sideOf(status: GameStatus): Side | undefined {
  if (status.kind === "toMove" || status.kind === "inCheck" || status.kind === "layingOut") return status.side;

  return undefined;
}

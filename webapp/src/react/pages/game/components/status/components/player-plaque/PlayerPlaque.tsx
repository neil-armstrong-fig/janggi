import type {PlaquePlayer} from "@src/react/pages/game/components/status/components/player-plaque/types/PlaquePlayer";
import type {PlaqueState} from "@src/react/pages/game/components/status/components/player-plaque/types/PlaqueState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {TakenTray} from "@src/react/pages/game/components/status/components/player-plaque/components/taken-tray/TakenTray";
import {clsx} from "clsx";
import {plaquePlayerFor} from "@src/react/pages/game/components/status/components/player-plaque/players/PlaquePlayerFor";
import {plaqueStateOf} from "@src/react/pages/game/components/status/components/player-plaque/plaque-state/PlaqueStateOf";
import {scoreFor} from "@src/game/scoring/ScoreFor";
import {sideName} from "@src/react/pages/game/utils/SideNames";
import {takenFrom} from "@src/game/scoring/TakenFrom";
import {useAppSelector} from "@src/redux/Hooks";
import {useGameStatus} from "@src/react/pages/game/components/status/hooks/use-game-status/UseGameStatus";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";
import {useRolledNumber} from "@src/react/pages/game/components/status/components/player-plaque/hooks/use-rolled-number/UseRolledNumber";

/**
 * One army's side of the frame: its name in its own colour, the pieces it has lost, and what it is
 * worth. Lit while the board is waiting on it, red while its general is attacked, gold once it has
 * won — so whose turn it is can be read from the edge of the eye without reading the herald at all.
 *
 * **The score is Han's 1.5 덤 folded in**, so the two figures are directly comparable — the whole
 * point of the half point being that they can never be equal. That is also why Han opens on 73.5
 * against Cho's 72 with nothing yet taken, which looks wrong for a moment and is exactly right. See
 * `docs/rules.md` §6.5. Each figure is its own element carrying `data-score`, which is what the
 * acceptance tests read rather than the words.
 *
 * With effects in full, a score counts down to its new value rather than jumping there, and a piece lost
 * pops into the tray. `data-score` is the true value throughout; only the words roll.
 *
 * **Against the bot, beside the name, who is playing the army**: a robot and the strength the bot plays
 * at, or a person, the player's own rating and the XP they have earned. Without it the bot's army reads
 * as a second person at the device, and the two ratings the game is being played between are nowhere on
 * the screen. The XP is here because this is the one place a player looks while playing, and it is what
 * the next board or piece set is waiting on.
 *
 * **What the XP is working towards is named beside it** — "(Next unlock: 1,200 XP, unlock Celadon
 * theme)" — because a number climbing on its own says nothing about what it is for. It truncates when
 * the plaque runs short, with the whole of it in the `title`. A million XP will not fit beside a rating
 * on a phone, so the amount already earned is shortened to `1M`, with `data-xp` carrying the true figure.
 *
 * **It is handed only which army it is**, and reads the rest for itself: the game, the rating, the XP, the
 * piece set the losses are drawn in, and what the game is doing, through `useGameStatus`. Nothing here is
 * stored — the state, the score and the losses are all derived from the position on each render.
 */
interface Props {
  readonly side: Side;
}

export function PlayerPlaque({side}: Props): React.JSX.Element {
  const {played, opponent} = useAppSelector(state => state.game);
  const playerElo = useAppSelector(state => state.ratings.byFormat[state.game.phase.format].elo);
  const xp = useAppSelector(state => state.progress.xp);
  const {pieceStyle, effects} = usePreferences();
  const {status} = useGameStatus();

  const game = played.present;
  const state = plaqueStateOf(status, side);
  const score = scoreFor(game, side);
  const player = plaquePlayerFor(side, opponent, playerElo, xp);
  const shownScore = useRolledNumber(score, effects.full);

  return (
    <section
      data-testid={`plaque-${side}`}
      data-state={state}
      aria-label={sideName(side)}
      className={clsx(
        "flex h-11 shrink-0 items-center gap-2 rounded-xl border px-3 transition-[background-color,border-color,opacity] duration-300 motion-reduce:transition-none",
        FRAMES[state],
      )}
    >
      <span
        aria-hidden
        className={clsx("h-2.5 w-2.5 shrink-0 rounded-full", DOTS[side], !ON_TURN[state] && "opacity-25")}
      />

      <span className={clsx("shrink-0 text-sm font-semibold tracking-wide", NAMES[side])}>{sideName(side)}</span>

      {player && (
        <span
          data-testid={`plaque-player-${side}`}
          data-player={player.kind}
          data-elo={player.elo}
          className="flex min-w-0 items-center gap-1 text-xs text-white/60 tabular-nums"
        >
          <span role="img" aria-label={PLAYER_LABELS[player.kind]}>
            {PLAYER_EMOJI[player.kind]}
          </span>

          {player.elo}

          {player.kind === "player" && (
            <span data-testid={`plaque-xp-${side}`} data-xp={player.xp} className="text-gold/80">
              {shortened(player.xp)} XP
            </span>
          )}

          {player.kind === "player" && player.nextUnlock && (
            <span
              data-testid={`plaque-next-unlock-${side}`}
              data-xp={player.nextUnlock.xp}
              title={`Next unlock: ${player.nextUnlock.xp.toLocaleString("en")} XP, unlock ${player.nextUnlock.labels.join(", ")}`}
              className="min-w-0 truncate text-white/40"
            >
              {`(Next unlock: ${player.nextUnlock.xp.toLocaleString("en")} XP, unlock ${player.nextUnlock.labels.join(", ")})`}
            </span>
          )}
        </span>
      )}

      <TakenTray side={side} taken={takenFrom(game, side)} pieceStyle={pieceStyle} popping={effects.full} />

      <span
        data-testid={`score-${side}`}
        data-score={score}
        className="ml-auto shrink-0 text-base font-semibold text-white/90 tabular-nums"
      >
        {shownScore}
      </span>
    </section>
  );
}

/** An amount of XP as it fits on a plaque: 640 stays 640, and 1,000,000 becomes 1M. */
function shortened(xp: number): string {
  return new Intl.NumberFormat("en", {notation: "compact", maximumFractionDigits: 1}).format(xp);
}

const PLAYER_EMOJI: Record<PlaquePlayer["kind"], string> = {bot: "🤖", player: "🧑"};

const PLAYER_LABELS: Record<PlaquePlayer["kind"], string> = {bot: "Bot", player: "You"};

const FRAMES: Record<PlaqueState, string> = {
  waiting: "border-white/5 bg-white/[0.03] opacity-70",
  toMove: "border-wood/40 bg-white/10",
  layingOut: "border-dashed border-wood/50 bg-white/5",
  inCheck: "border-danger/70 bg-danger/15",
  won: "border-gold/70 bg-gold/15",
  lost: "border-white/5 bg-transparent opacity-50",
  drawn: "border-white/15 bg-white/5",
};

/** Whether the board is waiting on this army, which is what lights the dot beside its name. */
const ON_TURN: Record<PlaqueState, boolean> = {
  waiting: false,
  toMove: true,
  layingOut: true,
  inCheck: true,
  won: false,
  lost: false,
  drawn: false,
};

const NAMES: Record<Side, string> = {cho: "text-cho", han: "text-han"};

const DOTS: Record<Side, string> = {cho: "bg-cho", han: "bg-han"};

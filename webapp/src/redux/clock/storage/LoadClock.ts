import type {ArmyClock} from "@src/redux/clock/types/ArmyClock";
import type {ArmyClocks} from "@src/redux/clock/types/ArmyClocks";
import {CLOCK_STORAGE_KEY} from "@src/redux/clock/storage/ClockStorageKey";
import type {ClockSliceState} from "@src/redux/clock/types/ClockSliceState";
import {FIRST_CLOCK} from "@src/redux/clock/first-clock/FirstClock";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";
import {TIME_CONTROL_FORMATS, TIME_CONTROL_NAMES} from "@janggi/shared/janggi/settings/TimeControlName";
import type {TimeControl} from "@janggi/shared/janggi/settings/TimeControl";
import type {TimeControlFormat, TimeControlName} from "@janggi/shared/janggi/settings/TimeControlName";
import type {Unchecked} from "@src/redux/untrusted/types/Unchecked";
import {clockAfterFlag} from "@src/redux/clock/spending/ClockAfterFlag";
import {clockTurnedOff} from "@src/redux/clock/time-controls/ClockTurnedOff";
import {freshArmiesOf} from "@src/redux/clock/spending/FreshArmiesOf";
import {isAmong} from "@src/redux/untrusted/IsAmong";
import {isFiniteNumber} from "@src/redux/untrusted/IsFiniteNumber";
import {isObject} from "@src/redux/untrusted/IsObject";
import {isOutOfTime} from "@src/redux/clock/spending/IsOutOfTime";
import {msLeftOf} from "@src/redux/clock/spending/MsLeftOf";
import {outcomeOf} from "@janggi/engine/OutcomeOf";
import {readJson} from "@src/redux/device-storage/ReadJson";
import {timeControlOf} from "@src/redux/clock/time-controls/TimeControlOf";
import {withinLimits} from "@src/redux/clock/time-controls/WithinLimits";

/**
 * The clock kept on the device, read in the light of the game come back to.
 *
 * **What was running comes back waiting.** A turn's start is never restored as it was stored, or the time away would be
 * charged: the clock comes back holding what the turn had spent (`heldMs`), which is what was stamped as the page was left,
 * or none of it where the page was killed with no warning. A clock with no game under way simply has all its time; one
 * whose time does not fit its format is turned off, since a game cannot be timed on figures nobody can trust. A game lost
 * on time stays lost, the engine having no idea of it. See `docs/rules.md` §6.7.
 */
export function loadClock(storage: Pick<Storage, "getItem"> | undefined, game: GameSliceState): ClockSliceState {
  const stored = readJson(storage, CLOCK_STORAGE_KEY);
  if (!isObject(stored)) return FIRST_CLOCK;

  const chosen: ClockSliceState = {
    name: nameFrom(stored["name"]),
    formatWhenOn: formatFrom(stored["formatWhenOn"]),
    custom: customFrom(stored["custom"]),
  };
  const timeControl = timeControlOf(chosen.name, chosen.custom);
  if (!timeControl) return chosen;

  if (game.played.past.length === 0) return {...chosen, armies: freshArmiesOf(timeControl)};

  const armies = armiesFrom(stored["armies"], timeControl);
  if (!armies) return clockTurnedOff(chosen);

  const kept = {...chosen, armies};
  if (!isStillToBePlayed(game, armies)) return kept;

  const side = game.played.present.sideToMove;
  const heldMs = heldMsFrom(stored);
  if (heldMs >= msLeftOf(armies[side], timeControl)) return clockAfterFlag(kept, side);

  return {...kept, heldMs};
}

/** Whether there is a turn to resume: between two people, with nobody out of time and the engine seeing no end to it. */
function isStillToBePlayed({opponent, played}: GameSliceState, armies: ArmyClocks): boolean {
  if (opponent.name !== "Human") return false;

  if (SIDES.some(side => isOutOfTime(armies[side]))) return false;

  return outcomeOf(played.present).kind === "undecided";
}

/** What the turn had spent: what a clock already waiting held, or else the time between its start and the page being left. */
function heldMsFrom(stored: Unchecked): number {
  const {heldMs, turnStartedAt, leftAt} = stored;
  if (isFiniteNumber(heldMs) && heldMs >= 0) return heldMs;

  if (!isFiniteNumber(turnStartedAt) || !isFiniteNumber(leftAt) || leftAt < turnStartedAt) return 0;

  return leftAt - turnStartedAt;
}

function nameFrom(value: unknown): TimeControlName {
  if (isAmong(TIME_CONTROL_NAMES, value)) return value;

  return FIRST_CLOCK.name;
}

function formatFrom(value: unknown): TimeControlFormat {
  if (isAmong(TIME_CONTROL_FORMATS, value)) return value;

  return FIRST_CLOCK.formatWhenOn;
}

function customFrom(value: unknown): TimeControl {
  if (!isObject(value)) return FIRST_CLOCK.custom;

  const {minutes, periodSeconds, periods} = value;
  if (!isFiniteNumber(minutes) || !isFiniteNumber(periodSeconds) || !isFiniteNumber(periods)) return FIRST_CLOCK.custom;

  return withinLimits({minutes, periodSeconds, periods});
}

function armiesFrom(value: unknown, timeControl: TimeControl): ArmyClocks | undefined {
  if (!isObject(value)) return undefined;

  const cho = armyClockFrom(value["cho"], timeControl);
  const han = armyClockFrom(value["han"], timeControl);
  if (!cho || !han) return undefined;

  return {cho, han};
}

/** An army's time, if it is time this format could have left it with. All of it gone is a game lost on time, and fits. */
function armyClockFrom(value: unknown, {minutes, periods: mostPeriods}: TimeControl): ArmyClock | undefined {
  if (!isObject(value)) return undefined;

  const {freeMs, periods} = value;
  if (!isFiniteNumber(freeMs) || freeMs < 0 || freeMs > minutes * 60_000) return undefined;

  if (!isFiniteNumber(periods) || !Number.isInteger(periods) || periods < 0 || periods > mostPeriods) return undefined;

  return {freeMs, periods};
}

import {BOT_ELOS} from "@janggi/shared/janggi/settings/BotElo";
import {FILES, RANKS} from "@src/game/board/BoardDimensions";
import {GAME_STORAGE_KEY} from "@src/redux/game/storage/GameStorageKey";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {GameState} from "@src/game/types/GameState";
import {MATCH_FORMATS} from "@janggi/shared/janggi/settings/MatchFormat";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import {OPPONENT_NAMES} from "@janggi/shared/janggi/settings/OpponentName";
import type {Opponent} from "@src/redux/game/types/Opponent";
import {PIECE_TYPES} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import {SETUPS} from "@src/game/setups/Setups";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";
import {SIDE_CHOICE_NAMES} from "@janggi/shared/janggi/settings/SideChoiceName";
import type {Setup} from "@src/game/setups/types/Setup";
import type {SetupPhase} from "@src/game/setups/types/SetupPhase";
import type {Standing} from "@src/game/types/Standing";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {isAmong} from "@src/redux/untrusted/IsAmong";
import {isObject} from "@src/redux/untrusted/IsObject";
import {readJson} from "@src/redux/device-storage/ReadJson";
import {toPositionKey} from "@src/game/board/PositionKeys";

/** A setup as it was kept: whatever sits beside its name is ignored, the name is looked up. */
type SetupChoice = Setup | undefined;

/**
 * The game kept on the device, or the first game where there is none to trust.
 *
 * **A kept game is rebuilt, never cast.** Every position in its record is checked piece by piece — a
 * real piece of a real army, on one of the 90 points, no two on one point, and a general each — along
 * with every field the rules read. A position that failed any of it would not be one the engine could
 * have produced, and handing it to `applyMove` or the bot is how a tampered file becomes a crash; so
 * the whole game is refused rather than any part of it patched. A game half-trusted is worse than a
 * fresh one.
 *
 * Setups are kept whole but read back by **name**, from the app's own `SETUPS`, so a back rank edited in
 * storage cannot reach the board. What is not checked is whether the record's positions follow from
 * one another by legal moves: replaying a game to prove it is a cost paid on every load for a file only
 * its own player can edit.
 */
export function loadGame(storage: Pick<Storage, "getItem"> | undefined): GameSliceState {
  return gameFrom(readJson(storage, GAME_STORAGE_KEY)) ?? firstGame();
}

function gameFrom(value: unknown): GameSliceState | undefined {
  if (!isObject(value)) return undefined;

  const played = recordFrom(value["played"]);
  const phase = phaseFrom(value["phase"]);
  const opponent = opponentFrom(value["opponent"]);
  if (!played || !phase || !opponent) return undefined;

  const positions = [...played.past, played.present, ...played.future];
  if (positions.some(position => position.format !== phase.format)) return undefined;

  // A go-ahead missing — a game kept before the bot waited for one — is read as not given. It only ever
  // holds the bot's first move, and a kept game past its opening has had that already.
  return {played, phase, opponent, botMayOpen: value["botMayOpen"] === true};
}

function recordFrom(value: unknown): PlayedGame | undefined {
  if (!isObject(value)) return undefined;

  const present = positionFrom(value["present"]);
  const past = everyOf(value["past"], positionFrom);
  const future = everyOf(value["future"], positionFrom);
  if (!present || !past || !future) return undefined;

  return {past, present, future};
}

function positionFrom(value: unknown): GameState | undefined {
  if (!isObject(value)) return undefined;

  const {sideToMove, format, consecutivePasses, reachedByAGeneralCapture, bikjangCalled} = value;
  const pieces = everyOf(value["pieces"], placedPieceFrom);
  const seen = everyOf(value["seen"], standingFrom);

  if (!pieces || !seen || !isAmong(SIDES, sideToMove) || !isAmong(MATCH_FORMATS, format)) return undefined;
  if (!Number.isInteger(consecutivePasses) || typeof consecutivePasses !== "number" || consecutivePasses < 0) {
    return undefined;
  }
  if (typeof reachedByAGeneralCapture !== "boolean" || typeof bikjangCalled !== "boolean") return undefined;
  if (!isABoard(pieces)) return undefined;

  return {pieces, sideToMove, format, consecutivePasses, seen, reachedByAGeneralCapture, bikjangCalled};
}

function placedPieceFrom(value: unknown): PlacedPiece | undefined {
  if (!isObject(value) || !isObject(value["piece"]) || !isObject(value["position"])) return undefined;

  const {side, type} = value["piece"];
  const {file, rank} = value["position"];
  if (!isAmong(SIDES, side) || !isAmong(PIECE_TYPES, type)) return undefined;
  if (!isAmong(FILES, file) || !isAmong(RANKS, rank)) return undefined;

  return {piece: {side, type}, position: {file, rank}};
}

function standingFrom(value: unknown): Standing | undefined {
  return typeof value === "string" && isStanding(value) ? value : undefined;
}

/** A standing is the board written out, then the army to move — `Standing`'s own template. */
function isStanding(value: string): value is Standing {
  return SIDES.some(side => value.endsWith(`:${side}`));
}

/** No two pieces on one point, and exactly one general for each army. */
function isABoard(pieces: readonly PlacedPiece[]): boolean {
  const points = new Set(pieces.map(({position}) => toPositionKey(position)));
  if (points.size !== pieces.length) return false;

  return SIDES.every(side => pieces.filter(({piece}) => piece.side === side && piece.type === "general").length === 1);
}

function phaseFrom(value: unknown): SetupPhase | undefined {
  if (!isObject(value) || !isAmong(MATCH_FORMATS, value["format"])) return undefined;

  const format: MatchFormat = value["format"];
  const hanSetup = setupFrom(value["hanSetup"]);
  const choSetup = setupFrom(value["choSetup"]);
  if (hanSetup === null || choSetup === null) return undefined;

  return {format, hanSetup, choSetup};
}

/** The app's setup of the kept name, undefined where none was chosen, or null where the name is unknown. */
function setupFrom(value: unknown): SetupChoice | null {
  if (value === undefined || value === null) return undefined;
  if (!isObject(value)) return null;

  return SETUPS.find(setup => setup.name === value["name"]) ?? null;
}

function opponentFrom(value: unknown): Opponent | undefined {
  if (!isObject(value)) return undefined;

  const {name, botElo, sideChoice, playerSide} = value;
  if (!isAmong(OPPONENT_NAMES, name) || !isAmong(BOT_ELOS, botElo)) return undefined;
  if (!isAmong(SIDE_CHOICE_NAMES, sideChoice) || !isAmong(SIDES, playerSide)) return undefined;

  return {name, botElo, sideChoice, playerSide};
}

/** Every member of a list read back by `from`, or undefined where it is not a list or any member fails. */
function everyOf<Member>(value: unknown, from: (member: unknown) => Member | undefined): Member[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const members: Member[] = [];
  for (const candidate of value) {
    const member = from(candidate);
    if (member === undefined) return undefined;

    members.push(member);
  }

  return members;
}

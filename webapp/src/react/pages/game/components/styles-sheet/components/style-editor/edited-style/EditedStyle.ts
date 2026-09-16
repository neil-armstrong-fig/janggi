import {BOARD_STYLE_NAMES} from "@janggi/shared/janggi/settings/BoardStyleName";
import {PIECE_SET_NAMES} from "@janggi/shared/janggi/settings/PieceSetName";
import type {StyleKind} from "@janggi/shared/janggi/settings/StyleKind";
import type {StyleOutcome} from "@src/react/pages/game/components/styles-sheet/types/StyleOutcome";
import {boardStyleFrom} from "@src/redux/custom-styles/untrusted/BoardStyleFrom";
import {isObject} from "@src/redux/untrusted/IsObject";
import {pieceSetStyleFrom} from "@src/redux/custom-styles/untrusted/PieceSetStyleFrom";

/**
 * The style a player has written in the editor — JSON for the style, and a name from the box above it —
 * checked exactly as an imported style is, or what to fix.
 *
 * The name box wins over any name in the JSON, and may not be a built-in's: a saved style is worn the
 * moment it is saved, by name, and a name the built-ins already answer to would never find it.
 */
export function editedStyle(kind: StyleKind, name: string, json: string): StyleOutcome {
  let written: unknown;

  try {
    written = JSON.parse(json);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);

    return {kind: "refused", reason: `The style is not JSON a browser can read: ${detail}`};
  }

  if (!isObject(written)) return {kind: "refused", reason: "The style should be one JSON object, in braces."};

  const named = {...written, name};

  if (kind === "Board") {
    if (BOARD_STYLE_NAMES.some(builtIn => builtIn === name.trim())) return nameTaken(name);

    const checked = boardStyleFrom(named);

    return checked.kind === "accepted" ? {kind: "board", style: checked.value} : checked;
  }

  if (PIECE_SET_NAMES.some(builtIn => builtIn === name.trim())) return nameTaken(name);

  const checked = pieceSetStyleFrom(named);

  return checked.kind === "accepted" ? {kind: "pieces", style: checked.value} : checked;
}

function nameTaken(name: string): StyleOutcome {
  return {kind: "refused", reason: `"${name.trim()}" is a built-in's name. Give yours one of its own.`};
}

import type {StyleRefusalMessages} from "@src/language/styles/style-messages/types/StyleRefusalMessages";
import type {WrittenStyle} from "@src/react/pages/game/components/styles-sheet/components/style-editor/style-text/types/WrittenStyle";
import {BOARD_STYLE_NAMES} from "@janggi/shared/janggi/settings/BoardStyleName";
import {PIECE_SET_NAMES} from "@janggi/shared/janggi/settings/PieceSetName";
import type {StyleOutcome} from "@src/react/pages/game/components/styles-sheet/types/StyleOutcome";
import {boardStyleFrom} from "@src/redux/custom-styles/untrusted/BoardStyleFrom";
import {objectFromText} from "@src/react/pages/game/components/styles-sheet/components/style-editor/style-text/ObjectFromText";
import {pieceSetStyleFrom} from "@src/redux/custom-styles/untrusted/PieceSetStyleFrom";

/**
 * The style a player has written in the editor — JSON for the style, and a name from the box above it —
 * checked exactly as an imported style is, or what to fix.
 *
 * The name box wins over any name in the JSON, may not be empty, and may not be a built-in's: a saved style is worn the
 * moment it is saved, by name, and a name the built-ins already answer to would never find it.
 */
export function editedStyle({styleKind, name, json}: WrittenStyle, words: StyleRefusalMessages): StyleOutcome {
  if (name.trim() === "") return {kind: "refused", reason: words.giveAName};

  const written = objectFromText(json, words);
  if (written.kind === "refused") return written;

  const named = {...written.value, name};

  if (styleKind === "Board") {
    if (BOARD_STYLE_NAMES.some(builtIn => builtIn === name.trim())) return nameTaken(name, words);

    const checked = boardStyleFrom(named);
    if (checked.kind === "accepted") {
      return {kind: "board", style: checked.value};
    }

    return checked;
  }

  if (PIECE_SET_NAMES.some(builtIn => builtIn === name.trim())) return nameTaken(name, words);

  const checked = pieceSetStyleFrom(named);
  if (checked.kind === "accepted") {
    return {kind: "pieces", style: checked.value};
  }

  return checked;
}

function nameTaken(name: string, words: StyleRefusalMessages): StyleOutcome {
  return {kind: "refused", reason: words.nameTaken(name.trim())};
}

import type {
  CharacterGlyphStyle,
  PictographGlyphStyle,
  PieceBodyStyle,
  PieceGlyphStyle,
  PieceInlayStyle,
  PieceStyle,
} from "@src/styles/types/PieceStyle";
import type {CharacterSet, PieceCharacter} from "@src/styles/types/CharacterSet";
import type {PieceOverrides, PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {Checked} from "@src/redux/custom-styles/untrusted/types/Checked";
import {DEFAULT_PIECE_HANDLING} from "@src/styles/defaults/DefaultPieceHandling";
import {PIECE_BODY_SHAPES, PIECE_GLYPH_KINDS} from "@src/styles/types/PieceStyle";
import type {PieceHandlingStyle} from "@src/styles/types/PieceHandlingStyle";
import type {PictographSet} from "@src/styles/types/PictographSet";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import {Reading} from "@src/redux/custom-styles/untrusted/reading/Reading";
import {RefusedReading} from "@src/redux/custom-styles/untrusted/reading/RefusedReading";
import {STYLE_LIMITS} from "@src/styles/limits/StyleLimits";
import {checkedBy} from "@src/redux/custom-styles/untrusted/reading/CheckedBy";
import {parsePieceKey} from "@janggi/shared/janggi/pieces/ParsePieceKey";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";

/**
 * A piece set somebody else wrote, checked all the way down, or the reason it is not one — the board
 * style's check, one level up. Its characters are drawn as text and its drawings as path data only, so
 * neither can carry anything but marks.
 */
export function pieceSetStyleFrom(value: unknown): Checked<PieceSetStyle> {
  return checkedBy(() => pieceSetStyle(Reading.of(value, "style")));
}

function pieceSetStyle(set: Reading): PieceSetStyle {
  const sides = set.object("sides");
  const pieces = set.optionalObject("pieces");

  return {
    name: set.name("name"),
    sides: {han: pieceStyle(sides.object("han")), cho: pieceStyle(sides.object("cho"))},
    handling: pieceHandling(set),
    ...(pieces === undefined ? {} : {pieces: pieceOverrides(pieces)}),
  };
}

/** How the set is handled as written, or as pieces were before a set could say — see `DEFAULT_PIECE_HANDLING`. */
function pieceHandling(pieceSetStyleReading: Reading): PieceHandlingStyle {
  const handling = pieceSetStyleReading.optionalObject("handling");
  if (handling === undefined) return DEFAULT_PIECE_HANDLING;

  return {
    shadow: handling.css("shadow"),
    hoverOutline: handling.number("hoverOutline", STYLE_LIMITS.hoverOutline),
  };
}

function pieceOverrides(pieces: Reading): PieceOverrides {
  return Object.fromEntries(
    pieces.keys().map(key => {
      const piece = parsePieceKey(key);
      if (!piece || toPieceKey(piece) !== key) {
        throw new RefusedReading(`${pieces.where(key)} is not a piece — name one <side>-<type>, like han-general`);
      }

      return [key, pieceStyle(pieces.object(key))];
    }),
  );
}

function pieceStyle(piece: Reading): PieceStyle {
  return {
    body: pieceBody(piece.object("body")),
    glyph: pieceGlyph(piece.object("glyph")),
    size: piece.number("size", STYLE_LIMITS.pieceSize),
  };
}

function pieceBody(body: Reading): PieceBodyStyle {
  const inlay = body.optionalObject("inlay");

  return {
    shape: body.among("shape", PIECE_BODY_SHAPES),
    fill: body.css("fill"),
    stroke: body.css("stroke"),
    strokeWidth: body.number("strokeWidth", STYLE_LIMITS.lineWidth),
    ...(inlay === undefined ? {} : {inlay: pieceInlay(inlay)}),
  };
}

function pieceInlay(inlay: Reading): PieceInlayStyle {
  const fill = inlay.optionalCss("fill");

  return {
    inset: inlay.number("inset", STYLE_LIMITS.inlayInset),
    stroke: inlay.css("stroke"),
    strokeWidth: inlay.number("strokeWidth", STYLE_LIMITS.lineWidth),
    ...(fill === undefined ? {} : {fill}),
  };
}

function pieceGlyph(glyph: Reading): PieceGlyphStyle {
  switch (glyph.among("kind", PIECE_GLYPH_KINDS)) {
    case "character":
      return characterGlyph(glyph);
    case "pictograph":
      return pictographGlyph(glyph);
  }
}

function characterGlyph(glyph: Reading): CharacterGlyphStyle {
  const slant = glyph.optionalNumber("slant", STYLE_LIMITS.glyphSlant);

  return {
    kind: "character",
    characters: characterSet(glyph.object("characters")),
    colour: glyph.css("colour"),
    scale: glyph.number("scale", STYLE_LIMITS.glyphScale),
    fontFamily: glyph.css("fontFamily"),
    fontWeight: glyph.number("fontWeight", STYLE_LIMITS.fontWeight),
    ...(slant === undefined ? {} : {slant}),
  };
}

function characterSet(characters: Reading): CharacterSet {
  return {
    general: pieceCharacter(characters, "general"),
    guard: pieceCharacter(characters, "guard"),
    horse: pieceCharacter(characters, "horse"),
    elephant: pieceCharacter(characters, "elephant"),
    chariot: pieceCharacter(characters, "chariot"),
    cannon: pieceCharacter(characters, "cannon"),
    soldier: pieceCharacter(characters, "soldier"),
  };
}

/** One character for both armies, or an object giving each its own. */
function pieceCharacter(characters: Reading, type: PieceType): PieceCharacter {
  if (!characters.isObject(type)) return characters.text(type);

  const pair = characters.object(type);

  return {han: pair.text("han"), cho: pair.text("cho")};
}

function pictographGlyph(glyph: Reading): PictographGlyphStyle {
  return {
    kind: "pictograph",
    pictographs: pictographSet(glyph.object("pictographs")),
    colour: glyph.css("colour"),
    scale: glyph.number("scale", STYLE_LIMITS.glyphScale),
  };
}

function pictographSet(pictographs: Reading): PictographSet {
  return {
    general: pictographs.path("general"),
    guard: pictographs.path("guard"),
    horse: pictographs.path("horse"),
    elephant: pictographs.path("elephant"),
    chariot: pictographs.path("chariot"),
    cannon: pictographs.path("cannon"),
    soldier: pictographs.path("soldier"),
  };
}

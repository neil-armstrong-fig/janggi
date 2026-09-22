import type {NumbersRead} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/pictograph-controls/svg-import/svg-paths/types/NumbersRead";
import type {Placement} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/pictograph-controls/svg-import/svg-paths/types/Placement";

/**
 * SVG path data moved to a new place: every point scaled and shifted, every length — a relative move, an
 * arc's radii — only scaled. Or undefined where the text is not path data this can read.
 *
 * Written out command by command, with each repeated set of numbers given its own command letter, so the
 * result is plain data whatever shorthand it came in: implicit repeats, numbers run together, and the arc
 * flags a minifier writes with nothing between them.
 */
export function transformedPath(data: string, placement: Placement): string | undefined {
  const written: string[] = [];
  let at = 0;

  while (at < data.length) {
    at = afterSeparators(data, at);
    if (at >= data.length) break;

    const letter = data.charAt(at);
    const command = letter.toUpperCase();
    const arity = ARITY[command];
    if (arity === undefined) return undefined;
    at++;

    if (arity === 0) {
      written.push(letter);
      continue;
    }

    let repeat = letter;
    let groups = 0;
    for (;;) {
      at = afterSeparators(data, at);
      if (at >= data.length || COMMAND_LETTER.test(data.charAt(at))) break;

      const numbersRead = numbersAt(data, at, command);
      if (!numbersRead) return undefined;

      // A path's first move is absolute, whichever case it is written in — there is nothing yet to be relative to.
      const relative = letter !== command && written.length > 0;

      written.push(repeat + placed(numbersRead.numbers, command, relative, placement).map(shown).join(" "));
      at = numbersRead.end;
      groups++;
      // What follows a move to a point is a line to the next.
      if (command === "M") repeat = letter === "M" ? "L" : "l";
    }

    if (groups === 0) return undefined;
  }

  return written.length === 0 ? undefined : written.join(" ");
}

function numbersAt(data: string, start: number, command: string): NumbersRead | undefined {
  const numbers: number[] = [];
  let at = start;

  for (let index = 0; index < (ARITY[command] ?? 0); index++) {
    at = afterSeparators(data, at);

    // An arc's two flags are one character each, and may be written with nothing between them.
    const isFlag = command === "A" && (index === 3 || index === 4);
    const found = isFlag ? FLAG.exec(data.slice(at, at + 1)) : numberAt(data, at);
    if (!found) return undefined;

    numbers.push(Number(found[0]));
    at += found[0].length;
  }

  return {numbers, end: at};
}

/** One group of numbers, moved: points scaled and shifted, or only scaled where they are relative. */
function placed(numbers: readonly number[], command: string, relative: boolean, {scale, dx, dy}: Placement): number[] {
  const x = (value: number): number => value * scale + (relative ? 0 : dx);
  const y = (value: number): number => value * scale + (relative ? 0 : dy);

  if (command === "H") return numbers.map(x);
  if (command === "V") return numbers.map(y);

  if (command === "A") {
    const [rx = 0, ry = 0, rotation = 0, large = 0, sweep = 0, endX = 0, endY = 0] = numbers;

    return [rx * scale, ry * scale, rotation, large, sweep, x(endX), y(endY)];
  }

  return numbers.map((value, index) => (index % 2 === 0 ? x(value) : y(value)));
}

/** To two places, which is finer than a piece is drawn, and never in the exponent form the path check would refuse. */
function shown(value: number): string {
  return String(Number(value.toFixed(2)));
}

function afterSeparators(data: string, from: number): number {
  let at = from;
  while (at < data.length && SEPARATOR.test(data.charAt(at))) at++;

  return at;
}

function numberAt(data: string, at: number): RegExpExecArray | null {
  NUMBER.lastIndex = at;

  return NUMBER.exec(data);
}

const ARITY: Readonly<Record<string, number>> = {M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0};
const COMMAND_LETTER = /[MmLlHhVvCcSsQqTtAaZz]/;
const SEPARATOR = /[\s,]/;
const FLAG = /^[01]$/;
const NUMBER = /[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/y;

/**
 * Whether a value read from outside is a CSS value the app will paint with — a colour, a gradient, a
 * font stack — and nothing that reaches beyond the page.
 *
 * A style a player imports is data somebody else wrote, and CSS can fetch. A `url(https://…)` or an
 * `image-set(…)` in a board's surface would load whatever its author pointed it at, every time the board
 * is drawn: a picture nobody has moderated, and a request that tells the author who is looking. So a
 * value that could fetch anything is refused, bar `url(#…)`, which names a gradient on the page itself.
 * So is anything that could climb out of the one property the value is set as — a semicolon, a brace,
 * an angle bracket, a comment — and a backslash, which could spell `url` another way.
 */
export function isCssValue(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= LONGEST &&
    !ESCAPING.test(value) &&
    !FETCHING.test(value.replace(ON_THE_PAGE, ""))
  );
}

const LONGEST = 500;
const ESCAPING = /[;{}<>\\]|\/\*/;
const ON_THE_PAGE = /url\(\s*['"]?#[^)]*\)/gi;
const FETCHING = /url\s*\(|image-set|src\s*\(|@import|expression\s*\(/i;

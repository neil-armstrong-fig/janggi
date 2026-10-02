/**
 * Pre-modern Korean generals and admirals, in English letters, to call a new account by. Each fits the longest a display
 * name may be, which the test beside this checks against the shared rule rather than trusting a count.
 */
const GENERALS = [
  "Yi Sun-sin",
  "Gwanggaeto the Great",
  "Eulji Mundeok",
  "Gang Gam-chan",
  "Kim Yu-sin",
  "Gyebaek",
  "Yeon Gaesomun",
  "Choe Yeong",
  "Yi Seong-gye",
  "Kwon Yul",
  "Gwak Jae-u",
  "Jeong Mun-bu",
  "Kim Si-min",
  "Yi Eok-gi",
  "Yang Man-chun",
  "Gim Jong-seo",
  "Yi Bun",
  "Kim Chwi-ryeo",
  "Ahn Ji",
  "Gwon Gi",
  "Seo Hui",
  "Kim Gyeong-seo",
] as const;

/**
 * A name for an account that has not chosen one, so nobody is called by their real name unless they say so. Not
 * unique: two players can be Yi Sun-sin, and nothing here depends on a name picking anybody out.
 *
 * @param random a number in [0, 1), taken as a parameter so a test can say which general it wants.
 */
export function generatedDisplayName(random: () => number): string {
  return GENERALS[Math.floor(random() * GENERALS.length)] ?? GENERALS[0];
}

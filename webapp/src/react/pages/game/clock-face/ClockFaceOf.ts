/** Seconds as a clock's face writes them: 272 is 4:32. */
export function clockFaceOf(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

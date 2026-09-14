import type {CueName} from "@src/audio/types/CueName";
import {GYEMYEONJO} from "@src/audio/modes/Gyemyeonjo";
import {PYEONGJO} from "@src/audio/modes/Pyeongjo";
import type {Voicing} from "@src/audio/cues/types/Voicing";
import {breath} from "@src/audio/instruments/Breath";
import {gayageum} from "@src/audio/instruments/Gayageum";
import {gong} from "@src/audio/instruments/Gong";
import {janggu} from "@src/audio/instruments/Janggu";
import {pitchOf} from "@src/audio/modes/PitchOf";
import {woodBlock} from "@src/audio/instruments/WoodBlock";

/**
 * How every cue is played, one voicing per cue — typed against the list of cues, so a cue added there
 * and given no sound here is a compile error rather than a silence.
 *
 * **The sounds a game makes most are wood, and the rarest are brass.** Pieces lifted, set down and
 * taken are the board and the pieces themselves; a check is a drum and a plucked figure, since it is
 * the game raising its voice; and the three endings are the gong, which is struck for nothing else.
 *
 * Every piece sound is pitched a few cents differently each time it plays. Sixty identical clacks in a
 * game are heard as a machine; sixty that differ by a hair are heard as a board.
 */
export const CUE_VOICINGS: Record<CueName, Voicing> = {
  pieceLifted,
  piecePlaced,
  pieceTaken,
  turnRested,
  turnTakenBack,
  check,
  checkmate,
  pointsWin,
  bikjang,
  dealt,
  controlPressed,
};

/** A light tick — the piece lifting off the wood. Heard often, so barely there. */
function pieceLifted(context: BaseAudioContext, destination: AudioNode, when: number): void {
  woodBlock(context, destination, when, {weight: 0.1, pitch: varied(980)});
}

function piecePlaced(context: BaseAudioContext, destination: AudioNode, when: number, weight: number): void {
  woodBlock(context, destination, when, {weight, pitch: varied(560)});
}

/** Slapped down, lower and harder the more the taken piece was worth, with a drum under a heavy one. */
function pieceTaken(context: BaseAudioContext, destination: AudioNode, when: number, weight: number): void {
  woodBlock(context, destination, when, {weight, pitch: varied(600 - 230 * weight)});

  if (weight >= HEAVY_CAPTURE) janggu(context, destination, when + 0.01, {head: "gung", weight: (weight - 0.5) * 1.6});
}

/** Two soft knocks: the general lifted off its point and set back down, which is how a turn is rested. */
function turnRested(context: BaseAudioContext, destination: AudioNode, when: number): void {
  woodBlock(context, destination, when, {weight: 0.3, pitch: varied(500)});
  woodBlock(context, destination, when + 0.17, {weight: 0.38, pitch: varied(460)});
}

/** A breath drawn in, and a tick as the piece is put back where it was. */
function turnTakenBack(context: BaseAudioContext, destination: AudioNode, when: number): void {
  breath(context, destination, when, {weight: 0.6, length: 0.13});
  woodBlock(context, destination, when + 0.13, {weight: 0.22, pitch: varied(720)});
}

/** The drum struck twice — stick then palm — under a rising figure in the dark mode. */
function check(context: BaseAudioContext, destination: AudioNode, when: number): void {
  janggu(context, destination, when, {head: "chae", weight: 0.7});
  janggu(context, destination, when + 0.09, {head: "gung", weight: 0.9});
  gayageum(context, destination, when + 0.02, {frequency: pitchOf(ROOT, GYEMYEONJO, 3), weight: 0.8, length: 0.5});
  gayageum(context, destination, when + 0.18, {frequency: pitchOf(ROOT, GYEMYEONJO, 5), weight: 0.9, length: 0.9});
}

/** The gong, and the dark mode falling away beneath it. */
function checkmate(context: BaseAudioContext, destination: AudioNode, when: number): void {
  gong(context, destination, when, {frequency: 98, weight: 1, length: 4.5});

  [8, 7, 5, 3, 2, 0].forEach((degree, index) => {
    gayageum(context, destination, when + 0.3 + index * 0.17, {
      frequency: pitchOf(ROOT, GYEMYEONJO, degree),
      weight: 0.7,
      length: 1.1,
    });
  });
}

/** A softer gong, and the open mode climbing: a game settled, rather than a game lost. */
function pointsWin(context: BaseAudioContext, destination: AudioNode, when: number): void {
  gong(context, destination, when, {frequency: 131, weight: 0.7, length: 3.5});

  [0, 2, 4, 5, 7].forEach((degree, index) => {
    gayageum(context, destination, when + 0.25 + index * 0.15, {
      frequency: pitchOf(ROOT * 1.19, PYEONGJO, degree),
      weight: 0.6,
      length: 0.9,
    });
  });
}

/** Two gongs answering each other — the two generals, face to face. */
function bikjang(context: BaseAudioContext, destination: AudioNode, when: number): void {
  gong(context, destination, when, {frequency: 110, weight: 0.9, length: 4});
  gong(context, destination, when + 0.5, {frequency: 165, weight: 0.7, length: 3.5});
}

/** A run of light clacks as the pieces are set out, in step with the board laying them down. */
function dealt(context: BaseAudioContext, destination: AudioNode, when: number): void {
  for (let piece = 0; piece < 10; piece += 1) {
    woodBlock(context, destination, when + piece * 0.055, {weight: 0.22, pitch: varied(640 - piece * 12)});
  }
}

/** The faintest tick, so a control answers a thumb before the game has had a chance to. */
function controlPressed(context: BaseAudioContext, destination: AudioNode, when: number): void {
  woodBlock(context, destination, when, {weight: 0.06, pitch: varied(1200)});
}

/** A pitch nudged a few cents either way, so no two strikes of the same sound are identical. */
function varied(pitch: number): number {
  return pitch * (1 + (Math.random() - 0.5) * 0.06);
}

/** The note everything tuned in this file is counted from, in hertz — A below middle C. */
const ROOT = 220;

/** From this weight a capture is heavy enough to bring the drum in under it. */
const HEAVY_CAPTURE = 0.8;

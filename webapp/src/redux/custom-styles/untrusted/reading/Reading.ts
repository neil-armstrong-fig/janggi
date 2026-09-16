import {RefusedReading} from "@src/redux/custom-styles/untrusted/reading/RefusedReading";
import type {Unchecked} from "@src/redux/untrusted/types/Unchecked";
import {isAmong} from "@src/redux/untrusted/IsAmong";
import {isCssValue} from "@src/redux/untrusted/IsCssValue";
import {isNumberBetween} from "@src/redux/untrusted/IsNumberBetween";
import {isObject} from "@src/redux/untrusted/IsObject";

/**
 * One JSON object of a style somebody else wrote, read a field at a time. Each read hands back the field
 * as the type a style needs it, or throws a `RefusedReading` naming where it is — `style.sides.han.size`
 * — and what it should have been.
 *
 * A style is deep and every level of it is checked the same few ways, so the checks are said once here
 * and `BoardStyleFrom` and `PieceSetStyleFrom` read as the shape of the style they build. Only the fields
 * asked for are ever copied out, so anything else written into the JSON is left behind.
 */
export class Reading {
  private readonly fields: Unchecked;
  private readonly location: string;

  private constructor(fields: Unchecked, path: string) {
    this.fields = fields;
    this.location = path;
  }

  static of(value: unknown, path: string): Reading {
    if (!isObject(value)) throw new RefusedReading(`${path} should be an object`);

    return new Reading(value, path);
  }

  keys(): readonly string[] {
    return Object.keys(this.fields);
  }

  isObject(key: string): boolean {
    return isObject(this.fields[key]);
  }

  object(key: string): Reading {
    return Reading.of(this.fields[key], this.at(key));
  }

  optionalObject(key: string): Reading | undefined {
    return this.isGiven(key) ? this.object(key) : undefined;
  }

  /** A style's name: what its picker shows, so something to read and not too long to fit. */
  name(key: string): string {
    const value = this.fields[key];
    if (typeof value !== "string" || value.trim() === "" || value.length > LONGEST_NAME) {
      throw new RefusedReading(`${this.at(key)} should be a name of 1 to ${LONGEST_NAME} characters`);
    }

    return value.trim();
  }

  /** A few characters written on a piece. */
  text(key: string): string {
    const value = this.fields[key];
    if (typeof value !== "string" || value === "" || value.length > LONGEST_TEXT) {
      throw new RefusedReading(`${this.at(key)} should be 1 to ${LONGEST_TEXT} characters`);
    }

    return value;
  }

  css(key: string): string {
    const value = this.fields[key];
    if (!isCssValue(value)) {
      throw new RefusedReading(
        `${this.at(key)} should be a CSS value that loads nothing from anywhere else — url(#…) is fine, url(https://…) is not`,
      );
    }

    return value;
  }

  optionalCss(key: string): string | undefined {
    return this.isGiven(key) ? this.css(key) : undefined;
  }

  number(key: string, least: number, most: number): number {
    const value = this.fields[key];
    if (!isNumberBetween(value, least, most)) {
      throw new RefusedReading(`${this.at(key)} should be a number from ${least} to ${most}`);
    }

    return value;
  }

  optionalNumber(key: string, least: number, most: number): number | undefined {
    return this.isGiven(key) ? this.number(key, least, most) : undefined;
  }

  among<Member extends string>(key: string, members: readonly Member[]): Member {
    const value = this.fields[key];
    if (!isAmong(members, value)) throw new RefusedReading(`${this.at(key)} should be one of ${members.join(", ")}`);

    return value;
  }

  /** SVG path data, and nothing but: commands and numbers. */
  path(key: string): string {
    const value = this.fields[key];
    if (typeof value !== "string" || value.length > LONGEST_PATH || !PATH_DATA.test(value)) {
      throw new RefusedReading(`${this.at(key)} should be SVG path data`);
    }

    return value;
  }

  where(key: string): string {
    return this.at(key);
  }

  private isGiven(key: string): boolean {
    return this.fields[key] !== undefined;
  }

  private at(key: string): string {
    return `${this.location}.${key}`;
  }
}

const LONGEST_NAME = 40;
const LONGEST_TEXT = 8;
const LONGEST_PATH = 20_000;
const PATH_DATA = /^[MmLlHhVvCcSsQqTtAaZz0-9eE.,+\-\s]*$/;
